// =============================================
// TONARINO - Google Maps API連携
// =============================================

const MapsService = {
  geocoder: null,
  placesService: null,
  autocompleteService: null,
  isInitialized: false,

  // 初期化
  init() {
    if (!window.CONFIG || !window.CONFIG.GOOGLE_MAPS_API_KEY ||
        window.CONFIG.GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.warn('Google Maps API Key未設定');
      return false;
    }

    if (typeof google !== 'undefined' && google.maps) {
      this.geocoder = new google.maps.Geocoder();
      this.placesService = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.isInitialized = true;
      console.log('Google Maps API initialized');
      return true;
    }
    return false;
  },

  // =============================================
  // 住所検索・オートコンプリート
  // =============================================

  // 住所候補を取得
  async searchAddress(query) {
    if (!this.isInitialized || !query) return [];

    return new Promise((resolve) => {
      this.autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'jp' },
          types: ['establishment', 'geocode'],
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions.map(p => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting.main_text,
              secondaryText: p.structured_formatting.secondary_text,
            })));
          } else {
            resolve([]);
          }
        }
      );
    });
  },

  // Place詳細を取得
  async getPlaceDetails(placeId) {
    if (!this.isInitialized || !placeId) return null;

    return new Promise((resolve) => {
      this.placesService.getDetails(
        {
          placeId: placeId,
          fields: [
            'place_id', 'name', 'formatted_address', 'geometry',
            'rating', 'user_ratings_total', 'reviews', 'types',
            'opening_hours', 'formatted_phone_number', 'website',
            'price_level', 'photos'
          ],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              placeId: place.place_id,
              name: place.name,
              address: place.formatted_address,
              latitude: place.geometry?.location?.lat(),
              longitude: place.geometry?.location?.lng(),
              rating: place.rating || 0,
              reviewCount: place.user_ratings_total || 0,
              phone: place.formatted_phone_number,
              website: place.website,
              priceLevel: place.price_level,
              types: place.types || [],
              openingHours: place.opening_hours?.weekday_text || [],
              reviews: (place.reviews || []).map(r => ({
                authorName: r.author_name,
                rating: r.rating,
                text: r.text,
                time: r.time,
                relativeTime: r.relative_time_description,
              })),
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  },

  // 住所から緯度経度を取得
  async geocodeAddress(address) {
    if (!this.isInitialized || !address) return null;

    return new Promise((resolve) => {
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng(),
            formattedAddress: results[0].formatted_address,
          });
        } else {
          resolve(null);
        }
      });
    });
  },

  // =============================================
  // 競合店検索
  // =============================================

  // 周辺の競合店を検索
  async searchNearbyCompetitors(latitude, longitude, category, radiusMeters = 2000) {
    if (!this.isInitialized) return [];

    // カテゴリをGoogle Placesのタイプに変換
    const typeMap = {
      '居酒屋': 'bar',
      'カフェ': 'cafe',
      'レストラン': 'restaurant',
      'ラーメン': 'restaurant',
      '焼肉': 'restaurant',
      '寿司': 'restaurant',
      'イタリアン': 'restaurant',
      '中華': 'restaurant',
      'その他': 'restaurant',
    };

    const type = typeMap[category] || 'restaurant';

    return new Promise((resolve) => {
      const location = new google.maps.LatLng(latitude, longitude);

      this.placesService.nearbySearch(
        {
          location: location,
          radius: radiusMeters,
          type: type,
          language: 'ja',
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const competitors = results.map(place => ({
              placeId: place.place_id,
              name: place.name,
              address: place.vicinity,
              rating: place.rating || 0,
              reviewCount: place.user_ratings_total || 0,
              priceLevel: place.price_level,
              types: place.types || [],
              latitude: place.geometry?.location?.lat(),
              longitude: place.geometry?.location?.lng(),
              distanceMeters: this.calculateDistance(
                latitude, longitude,
                place.geometry?.location?.lat(),
                place.geometry?.location?.lng()
              ),
            }));

            // 距離でソート
            competitors.sort((a, b) => a.distanceMeters - b.distanceMeters);
            resolve(competitors);
          } else {
            resolve([]);
          }
        }
      );
    });
  },

  // 駅周辺の店舗を検索
  async searchNearStation(stationName, category, radiusMeters = 500) {
    if (!this.isInitialized || !stationName) return [];

    // まず駅の位置を取得
    const stationQuery = stationName.includes('駅') ? stationName : `${stationName}駅`;
    const stationLocation = await this.geocodeAddress(stationQuery);

    if (!stationLocation) return [];

    return this.searchNearbyCompetitors(
      stationLocation.latitude,
      stationLocation.longitude,
      category,
      radiusMeters
    );
  },

  // =============================================
  // ユーティリティ
  // =============================================

  // 2点間の距離を計算（メートル）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // 地球の半径（メートル）
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  toRad(deg) {
    return deg * (Math.PI / 180);
  },

  // 距離をフォーマット
  formatDistance(meters) {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  },

  // =============================================
  // 口コミ分析用データ取得
  // =============================================

  // 複数店舗の口コミを一括取得
  async getMultipleShopReviews(placeIds) {
    if (!this.isInitialized || !placeIds || placeIds.length === 0) return [];

    const results = [];
    for (const placeId of placeIds) {
      const details = await this.getPlaceDetails(placeId);
      if (details) {
        results.push(details);
      }
      // API制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    return results;
  },

  // エリア全体の統計を計算
  calculateAreaStats(shops) {
    if (!shops || shops.length === 0) {
      return {
        avgRating: 0,
        avgReviewCount: 0,
        totalShops: 0,
        ratingDistribution: {},
      };
    }

    const totalShops = shops.length;
    const avgRating = shops.reduce((sum, s) => sum + (s.rating || 0), 0) / totalShops;
    const avgReviewCount = shops.reduce((sum, s) => sum + (s.reviewCount || 0), 0) / totalShops;

    // 評価分布
    const ratingDistribution = {};
    shops.forEach(s => {
      const rating = Math.floor(s.rating || 0);
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    return {
      avgRating: Math.round(avgRating * 10) / 10,
      avgReviewCount: Math.round(avgReviewCount),
      totalShops,
      ratingDistribution,
    };
  },

  // 自店舗のランキングを計算
  calculateRanking(myShop, competitors, category = 'rating') {
    if (!myShop || !competitors || competitors.length === 0) {
      return { rank: 1, total: 1 };
    }

    const allShops = [myShop, ...competitors];

    // カテゴリに応じてソート
    switch (category) {
      case 'rating':
        allShops.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviewCount':
        allShops.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        allShops.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const rank = allShops.findIndex(s => s.placeId === myShop.placeId) + 1;

    return {
      rank: rank || allShops.length,
      total: allShops.length,
    };
  },
};

// グローバルに公開
window.MapsService = MapsService;

// Google Maps APIが読み込まれたら初期化
if (typeof google !== 'undefined' && google.maps) {
  MapsService.init();
}
