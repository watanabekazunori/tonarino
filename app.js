const { useState, useEffect, useCallback } = React;

// ========== アイコンコンポーネント ==========
const Icons = {
  Star: ({ filled, className = "w-4 h-4" }) => (
    <svg className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  TrendUp: () => (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Trophy: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  LightBulb: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Spinner: () => (
    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
};

// ========== 共通コンポーネント ==========
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Icons.Star key={star} filled={star <= Math.round(rating)} />
    ))}
    <span className="ml-1 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
  </div>
);

// 広告バナー
const AdBanner = ({ position = "top" }) => (
  <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg p-3 text-center ${position === 'bottom' ? 'mt-4' : 'mb-4'}`}>
    <p className="text-xs text-gray-400">広告スペース</p>
    <p className="text-xs text-gray-300">320×50 / 320×100</p>
  </div>
);

// ローディング
const Loading = ({ message = "読み込み中..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Icons.Spinner />
    <p className="mt-2 text-sm text-gray-500">{message}</p>
  </div>
);

// エラーメッセージ
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <p className="text-red-600 text-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-2 text-sm text-red-500 underline">再試行</button>
    )}
  </div>
);

// ========== ログイン画面 ==========
const LoginScreen = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Supabase認証
      if (window.TonarinoDB && window.CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        await window.TonarinoDB.Auth.signIn(email, password);
      }
      onLogin();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // デモモード（Supabase未設定時）
  const handleDemoLogin = () => {
    onLogin();
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">TONARINO</h1>
          <p className="text-xs text-gray-400 tracking-widest">トナリノ</p>
          <p className="text-sm text-gray-500 mt-2">隣のお店、気になりませんか？</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Icons.Spinner /> : 'ログイン'}
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            新規登録
          </button>

          {/* デモモード */}
          {(!window.CONFIG || window.CONFIG.SUPABASE_URL === 'YOUR_SUPABASE_URL') && (
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full text-orange-500 py-2 text-sm"
            >
              デモモードで試す →
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

// ========== 新規登録画面 ==========
const SignUpScreen = ({ onSignUp, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (window.TonarinoDB && window.CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        await window.TonarinoDB.Auth.signUp(email, password);
        setSuccess(true);
      } else {
        // デモモード
        onSignUp();
      }
    } catch (err) {
      console.error('SignUp error:', err);
      setError(err.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-500 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">登録完了</h2>
          <p className="text-sm text-gray-600 mb-4">
            確認メールを送信しました。<br />
            メール内のリンクをクリックして登録を完了してください。
          </p>
          <button
            onClick={onBack}
            className="w-full gradient-primary text-white py-3 rounded-lg font-semibold"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-sm mx-auto">
        <button onClick={onBack} className="text-gray-500 mb-4">← 戻る</button>
        <h1 className="text-xl font-bold text-gray-800 mb-6">アカウント作成</h1>

        <form onSubmit={handleSignUp} className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード * (6文字以上)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード確認 *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-white py-3 rounded-lg font-semibold mt-4 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Icons.Spinner /> : 'アカウントを作成'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== 店舗登録画面 ==========
const RegisterShopScreen = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    station: '',
    category: '居酒屋',
    latitude: null,
    longitude: null,
    googlePlaceId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchMode, setSearchMode] = useState('name'); // 'name' or 'manual'

  // Google Places検索
  const handleSearch = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    if (!window.MapsService || !window.MapsService.isInitialized) {
      // Google Maps未設定の場合はスキップ
      return;
    }

    setIsSearching(true);
    try {
      const results = await window.MapsService.searchAddress(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // 検索クエリ変更時に検索実行（デバウンス）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchMode === 'name') {
        handleSearch(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchMode, handleSearch]);

  // 検索結果から店舗を選択
  const handleSelectPlace = async (place) => {
    if (!window.MapsService || !window.MapsService.isInitialized) return;

    setIsSearching(true);
    try {
      const details = await window.MapsService.getPlaceDetails(place.placeId);
      if (details) {
        setSelectedPlace(details);
        setFormData({
          ...formData,
          shopName: details.name || '',
          address: details.address || '',
          latitude: details.latitude,
          longitude: details.longitude,
          googlePlaceId: details.placeId,
          phone: details.phone || formData.phone,
        });
        setSearchResults([]);
        setSearchQuery('');
      }
    } catch (err) {
      console.error('Place details error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName || !formData.ownerName || !formData.email || !formData.phone || !formData.address) {
      setError('必須項目をすべて入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 緯度経度がない場合はジオコーディング
      let finalData = { ...formData };
      if (!finalData.latitude && window.MapsService && window.MapsService.isInitialized) {
        const geocoded = await window.MapsService.geocodeAddress(formData.address);
        if (geocoded) {
          finalData.latitude = geocoded.latitude;
          finalData.longitude = geocoded.longitude;
        }
      }

      if (window.TonarinoDB && window.CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        const savedShop = await window.TonarinoDB.ShopService.createShop(finalData);
        onRegister(savedShop);
      } else {
        // デモモード
        onRegister(finalData);
      }
    } catch (err) {
      console.error('Shop registration error:', err);
      setError(err.message || '店舗登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const mapsAvailable = window.MapsService && window.MapsService.isInitialized;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-sm mx-auto">
        {onBack && <button onClick={onBack} className="text-gray-500 mb-4">← 戻る</button>}
        <h1 className="text-xl font-bold text-gray-800 mb-6">店舗情報を登録</h1>

        {/* Google検索 or 手動入力 切り替え */}
        {mapsAvailable && (
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSearchMode('name')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                searchMode === 'name' ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              🔍 店名で検索
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('manual')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                searchMode === 'manual' ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              ✏️ 手動入力
            </button>
          </div>
        )}

        {/* Google検索モード */}
        {mapsAvailable && searchMode === 'name' && !selectedPlace && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Googleマップから店舗を検索
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="店舗名や住所を入力..."
              />
              {isSearching && (
                <div className="absolute right-3 top-3">
                  <Icons.Spinner />
                </div>
              )}
            </div>

            {/* 検索結果 */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                {searchResults.map((place, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPlace(place)}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-gray-100 last:border-0"
                  >
                    <p className="font-medium text-gray-800 text-sm">{place.mainText}</p>
                    <p className="text-xs text-gray-500">{place.secondaryText}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 選択した店舗情報 */}
        {selectedPlace && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">{selectedPlace.name}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedPlace.address}</p>
                {selectedPlace.rating > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={selectedPlace.rating} />
                    <span className="text-xs text-gray-500">({selectedPlace.reviewCount}件)</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlace(null);
                  setFormData({
                    ...formData,
                    shopName: '',
                    address: '',
                    latitude: null,
                    longitude: null,
                    googlePlaceId: null,
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">店舗名 *</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="例: 居酒屋 さくら"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">住所 *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="例: 大阪府大阪市中央区..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最寄り駅</label>
            <input
              type="text"
              name="station"
              value={formData.station}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="例: 梅田駅"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">業態 *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="居酒屋">居酒屋</option>
              <option value="カフェ">カフェ</option>
              <option value="レストラン">レストラン</option>
              <option value="ラーメン">ラーメン</option>
              <option value="焼肉">焼肉</option>
              <option value="寿司">寿司</option>
              <option value="イタリアン">イタリアン</option>
              <option value="中華">中華</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <hr className="border-gray-200" />
          <p className="text-xs text-gray-500">オーナー情報（非公開）</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">オーナー名 *</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="山田 太郎"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="06-1234-5678"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-white py-3 rounded-lg font-semibold mt-4 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Icons.Spinner /> : '登録して分析を開始'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== ダッシュボード ==========
const Dashboard = ({ shop, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [competitors, setCompetitors] = useState([]);
  const [myShopData, setMyShopData] = useState(null);
  const [rankings, setRankings] = useState({});
  const [areaStats, setAreaStats] = useState(null);

  const myShop = shop || {
    shop_name: "居酒屋 さくら",
    station: "梅田駅",
    category: "居酒屋",
  };

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Google Maps APIが有効な場合
        if (window.MapsService && window.MapsService.isInitialized && shop?.googlePlaceId) {
          // 自店舗の最新データ取得
          const shopDetails = await window.MapsService.getPlaceDetails(shop.googlePlaceId);
          if (shopDetails) {
            setMyShopData(shopDetails);
          }

          // 競合店検索
          if (shop.latitude && shop.longitude) {
            const nearbyShops = await window.MapsService.searchNearbyCompetitors(
              shop.latitude,
              shop.longitude,
              shop.category,
              window.CONFIG?.DEFAULT_RADIUS_KM ? window.CONFIG.DEFAULT_RADIUS_KM * 1000 : 2000
            );
            // 自店舗を除外
            const filteredCompetitors = nearbyShops.filter(s => s.placeId !== shop.googlePlaceId);
            setCompetitors(filteredCompetitors);

            // エリア統計計算
            const stats = window.MapsService.calculateAreaStats([shopDetails, ...filteredCompetitors]);
            setAreaStats(stats);

            // ランキング計算
            if (shopDetails) {
              const ratingRank = window.MapsService.calculateRanking(shopDetails, filteredCompetitors, 'rating');
              const reviewRank = window.MapsService.calculateRanking(shopDetails, filteredCompetitors, 'reviewCount');
              setRankings({
                '総合評価': ratingRank,
                '口コミ数': reviewRank,
              });
            }
          }
        }
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    // 少し遅延させてAPIの初期化を待つ
    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [shop]);

  // 表示用データ（実データ or デモデータ）
  const displayData = myShopData || {
    rating: 4.2,
    reviewCount: 156,
  };

  const stats = {
    rating: displayData.rating || 4.2,
    reviewCount: displayData.reviewCount || 156,
    rank: rankings['総合評価']?.rank || 3,
    totalShops: rankings['総合評価']?.total || (competitors.length + 1) || 24,
    trendValue: "+0.2"
  };

  const rankingCategories = [
    { name: "総合評価", myRank: rankings['総合評価']?.rank || 3, icon: "⭐", total: rankings['総合評価']?.total || 24 },
    { name: "口コミ数", myRank: rankings['口コミ数']?.rank || 5, icon: "💬", total: rankings['口コミ数']?.total || 24 },
    { name: "コスパ", myRank: 2, icon: "💰", total: 24 },
    { name: "評価上昇率", myRank: 1, icon: "📈", total: 24 },
    { name: "料理の味", myRank: 4, icon: "🍳", total: 24 },
    { name: "接客", myRank: 2, icon: "😊", total: 24 },
  ];

  return (
    <div className="space-y-4">
      <AdBanner position="top" />

      {/* ヘッダー */}
      <div className="gradient-primary rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icons.MapPin />
              <span className="text-sm opacity-90">
                {myShop.station || '未設定'}周辺 / {myShop.category}
              </span>
            </div>
            <h2 className="text-xl font-bold">{myShop.shop_name || myShop.shopName}</h2>
          </div>
          {loading && <Icons.Spinner />}
        </div>
        {myShopData && (
          <div className="mt-2 flex items-center gap-2 text-sm opacity-90">
            <span>Googleから取得</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">リアルタイム</span>
          </div>
        )}
      </div>

      {/* スコアカード */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">評価スコア</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{stats.rating.toFixed(1)}</span>
            <div className="flex items-center text-green-500 text-sm">
              <Icons.TrendUp />
              <span className="ml-1">{stats.trendValue}</span>
            </div>
          </div>
          <StarRating rating={stats.rating} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">総合ランキング</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-orange-500">{stats.rank}位</span>
            <span className="text-sm text-gray-500">/ {stats.totalShops}店</span>
          </div>
          <div className="mt-1 bg-orange-100 rounded-full h-2">
            <div className="gradient-primary rounded-full h-2" style={{ width: `${((stats.totalShops - stats.rank + 1) / stats.totalShops) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* エリア統計 */}
      {areaStats && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-2">📍 エリア平均との比較</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">エリア平均評価</span>
              <p className="font-bold text-gray-800">{areaStats.avgRating}</p>
              <p className={`text-xs ${stats.rating > areaStats.avgRating ? 'text-green-600' : 'text-red-600'}`}>
                {stats.rating > areaStats.avgRating ? `+${(stats.rating - areaStats.avgRating).toFixed(1)}` : (stats.rating - areaStats.avgRating).toFixed(1)}
              </p>
            </div>
            <div>
              <span className="text-gray-500">エリア平均口コミ</span>
              <p className="font-bold text-gray-800">{areaStats.avgReviewCount}件</p>
              <p className={`text-xs ${stats.reviewCount > areaStats.avgReviewCount ? 'text-green-600' : 'text-red-600'}`}>
                {stats.reviewCount > areaStats.avgReviewCount ? `+${stats.reviewCount - areaStats.avgReviewCount}` : stats.reviewCount - areaStats.avgReviewCount}件
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ランキング一覧 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">📊 あなたのお店のランキング</h3>
        <div className="grid grid-cols-3 gap-2">
          {rankingCategories.map((cat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-xs text-gray-500 mt-1">{cat.name}</p>
              <p className="text-lg font-bold text-gray-800">
                {cat.myRank}位
                {cat.myRank <= 3 && <span className="ml-1">{cat.myRank === 1 ? '🥇' : cat.myRank === 2 ? '🥈' : '🥉'}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 近隣競合店 */}
      {competitors.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">🏪 近隣の競合店 ({competitors.length}店)</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {competitors.slice(0, 5).map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">{comp.name}</p>
                  <p className="text-xs text-gray-500">{window.MapsService?.formatDistance(comp.distanceMeters)}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Icons.Star filled className="w-3 h-3" />
                    <span className="font-semibold text-sm">{comp.rating?.toFixed(1) || '-'}</span>
                  </div>
                  <p className="text-xs text-gray-500">{comp.reviewCount || 0}件</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 口コミサマリー */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">💬 口コミサマリー</h3>
        <div className="flex justify-between text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.reviewCount}</p>
            <p className="text-xs text-gray-500">総口コミ数</p>
          </div>
          <div className="border-l border-gray-200 pl-4">
            <p className="text-2xl font-bold text-green-500">78%</p>
            <p className="text-xs text-gray-500">ポジティブ</p>
          </div>
          <div className="border-l border-gray-200 pl-4">
            <p className="text-2xl font-bold text-red-500">12%</p>
            <p className="text-xs text-gray-500">ネガティブ</p>
          </div>
        </div>
      </div>

      {/* 課題アラート */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <h3 className="font-semibold text-gray-800 mb-2">⚠️ 今すぐ対策が必要な課題</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icons.Alert />
            <span>「待ち時間が長い」の声が増加中（12件）</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icons.Alert />
            <span>「価格が高い」で競合に負けています</span>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  );
};

// ========== ランキング画面 ==========
const RankingScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('総合評価');

  const categories = [
    { id: '総合評価', name: '総合評価', icon: '⭐' },
    { id: '口コミ数', name: '口コミ数', icon: '💬' },
    { id: 'コスパ', name: 'コスパ', icon: '💰' },
    { id: '客単価安い', name: '客単価(安)', icon: '💴' },
    { id: '客単価高い', name: '客単価(高)', icon: '💎' },
    { id: '評価上昇率', name: '上昇率', icon: '📈' },
    { id: '料理', name: '料理', icon: '🍳' },
    { id: '接客', name: '接客', icon: '😊' },
    { id: '雰囲気', name: '雰囲気', icon: '✨' },
    { id: '清潔感', name: '清潔感', icon: '🧹' },
    { id: '新着口コミ', name: '新着', icon: '🆕' },
    { id: 'リピート', name: 'リピート', icon: '🔄' },
  ];

  const rankingData = [
    { rank: 1, name: "炭火焼鳥 とり松", value: "4.6", sub: "312件", change: 0 },
    { rank: 2, name: "酒処 なにわ", value: "4.4", sub: "245件", change: 1 },
    { rank: 3, name: "居酒屋 さくら", value: "4.2", sub: "156件", change: 2, isMyShop: true },
    { rank: 4, name: "串カツ 大阪屋", value: "4.1", sub: "198件", change: -1 },
    { rank: 5, name: "居酒屋 月", value: "4.0", sub: "87件", change: -2 },
  ];

  const myRank = rankingData.find(r => r.isMyShop)?.rank || '-';

  return (
    <div className="space-y-4">
      <AdBanner position="top" />

      <h2 className="text-lg font-bold text-gray-800">🏆 ランキング</h2>

      <div className="gradient-primary rounded-xl p-4 text-white">
        <p className="text-sm opacity-90">「{selectedCategory}」でのあなたの順位</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-bold">{myRank}位</span>
          <span className="text-lg opacity-80">/ 24店中</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">ランキングカテゴリ</h3>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-2 rounded-lg text-center transition ${
                selectedCategory === cat.id
                  ? 'bg-orange-100 border-2 border-orange-400'
                  : 'bg-gray-50 border-2 border-transparent'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <p className="text-xs mt-1 text-gray-700 leading-tight">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">{selectedCategory}ランキング</h3>
        <div className="space-y-2">
          {rankingData.map((shop) => (
            <div
              key={shop.rank}
              className={`flex items-center gap-3 p-3 rounded-lg ${shop.isMyShop ? 'bg-orange-50 border-2 border-orange-300' : 'bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                ${shop.rank === 1 ? 'bg-yellow-400 text-white' :
                  shop.rank === 2 ? 'bg-gray-300 text-white' :
                  shop.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {shop.rank}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${shop.isMyShop ? 'text-orange-600' : 'text-gray-800'}`}>
                  {shop.name}
                  {shop.isMyShop && <span className="ml-1 text-xs bg-orange-200 px-1 rounded">あなた</span>}
                </p>
                <p className="text-xs text-gray-500">{shop.sub}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{shop.value}</p>
                <div className="text-xs">
                  {shop.change > 0 && <span className="text-green-500">↑{shop.change}</span>}
                  {shop.change < 0 && <span className="text-red-500">↓{Math.abs(shop.change)}</span>}
                  {shop.change === 0 && <span className="text-gray-400">-</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  );
};

// ========== 課題分析画面 ==========
const AnalysisScreen = ({ shop }) => {
  const [activeTab, setActiveTab] = useState('issues');
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(null);
  const [expandedIssue, setExpandedIssue] = useState(null);

  // AI分析を実行
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        // AIサービスから分析データを取得
        if (window.AIService) {
          window.AIService.init();
          const analysis = await window.AIService.analyzeReviews([], {
            name: shop?.shop_name || shop?.shopName,
            category: shop?.category,
          });
          setAnalysisData(analysis);
        }
      } catch (err) {
        console.error('Analysis error:', err);
        // デモデータをフォールバック
        if (window.AIService) {
          setAnalysisData(window.AIService.getDemoAnalysis());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [shop]);

  // 対策詳細を取得
  const handleExpandIssue = async (issue, idx) => {
    if (expandedIssue === idx) {
      setExpandedIssue(null);
      return;
    }

    setExpandedIssue(idx);

    // すでにsolutionsがある場合はスキップ
    if (issue.solutions && issue.solutions.length > 0) return;

    // AI対策を追加取得
    if (window.AIService && window.AIService.isInitialized) {
      const solutions = await window.AIService.generateSolutions(issue);
      if (solutions && analysisData) {
        const updatedIssues = [...analysisData.issues];
        updatedIssues[idx] = { ...issue, solutions: solutions.solutions };
        setAnalysisData({ ...analysisData, issues: updatedIssues });
      }
    }
  };

  // 表示用データ
  const issues = analysisData?.issues || [];
  const strengths = analysisData?.strengths || [];
  const sentiment = analysisData?.sentiment || { positive: 78, negative: 12, neutral: 10 };
  const allItems = [...issues, ...strengths];

  const comparison = [
    { category: "総合評価", diff: "+0.2", status: "win" },
    { category: "料理の味", diff: "+0.4", status: "win" },
    { category: "接客", diff: "+0.4", status: "win" },
    { category: "価格満足度", diff: "-0.3", status: "lose" },
    { category: "待ち時間", diff: "-0.5", status: "lose" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <AdBanner position="top" />
        <h2 className="text-lg font-bold text-gray-800">🔍 課題分析 & 対策</h2>
        <Loading message="AIが口コミを分析中..." />
        <AdBanner position="bottom" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdBanner position="top" />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">🔍 課題分析 & 対策</h2>
        {window.AIService?.isInitialized && (
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">AI分析</span>
        )}
      </div>

      {/* 感情分析サマリー */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">📊 口コミの感情分布</h3>
        <div className="flex h-4 rounded-full overflow-hidden mb-2">
          <div className="bg-green-500" style={{ width: `${sentiment.positive}%` }} />
          <div className="bg-gray-300" style={{ width: `${sentiment.neutral}%` }} />
          <div className="bg-red-500" style={{ width: `${sentiment.negative}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span className="text-green-600">ポジティブ {sentiment.positive}%</span>
          <span>中立 {sentiment.neutral}%</span>
          <span className="text-red-600">ネガティブ {sentiment.negative}%</span>
        </div>
      </div>

      {/* 分析サマリー */}
      {analysisData?.summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">💡 {analysisData.summary}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'issues' ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          課題と強み
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'compare' ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          競合比較
        </button>
      </div>

      {activeTab === 'issues' && (
        <>
          {allItems.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-gray-500">分析データがありません</p>
              <p className="text-sm text-gray-400 mt-1">口コミが蓄積されると分析結果が表示されます</p>
            </div>
          ) : (
            allItems.map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                  item.type === 'negative' ? 'border-red-400' : 'border-green-400'
                }`}
              >
                <button
                  onClick={() => handleExpandIssue(item, idx)}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'negative' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type === 'negative' ? '要改善' : '強み'}
                      </span>
                      <span className="font-semibold text-gray-800">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{item.mentionCount || item.count}件</span>
                      <span className={`text-gray-400 transition-transform ${expandedIssue === idx ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{item.summary}</p>
                </button>

                {/* 展開時の詳細 */}
                {expandedIssue === idx && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {item.details && (
                      <p className="text-sm text-gray-600 mt-3 mb-3">{item.details}</p>
                    )}

                    {/* 対策案（課題の場合） */}
                    {item.type === 'negative' && item.solutions && item.solutions.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <p className="text-xs font-medium text-gray-500">💡 AI推奨の対策案</p>
                        {item.solutions.map((sol, i) => (
                          <div key={i} className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-800">{sol.title}</span>
                              <div className="flex gap-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  sol.effort === '低' ? 'bg-green-100 text-green-700' : sol.effort === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  工数:{sol.effort}
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">効果:{sol.impact}</span>
                              </div>
                            </div>
                            {sol.description && (
                              <p className="text-xs text-gray-600">{sol.description}</p>
                            )}
                            {(sol.cost || sol.timeToImplement) && (
                              <div className="flex gap-2 mt-1">
                                {sol.cost && <span className="text-xs text-gray-500">💰 {sol.cost}</span>}
                                {sol.timeToImplement && <span className="text-xs text-gray-500">⏱ {sol.timeToImplement}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 活かし方（強みの場合） */}
                    {item.type === 'positive' && item.recommendations && item.recommendations.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <p className="text-xs font-medium text-gray-500">🚀 この強みを活かすには</p>
                        {item.recommendations.map((rec, i) => (
                          <div key={i} className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <span className="font-medium text-sm text-gray-800">{rec.title}</span>
                            {rec.description && (
                              <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </>
      )}

      {activeTab === 'compare' && (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">競合店との比較</h3>
            <div className="space-y-2">
              {comparison.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <span className={`font-medium ${
                    item.status === 'win' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.diff}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
              <p className="text-2xl font-bold text-green-600">{comparison.filter(c => c.status === 'win').length}</p>
              <p className="text-xs text-gray-500">勝ち</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center border border-red-200">
              <p className="text-2xl font-bold text-red-500">{comparison.filter(c => c.status === 'lose').length}</p>
              <p className="text-xs text-gray-500">負け</p>
            </div>
          </div>

          {/* AI分析の競争優位性 */}
          {competitorAnalysis && (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">🎯 競争優位性</h3>
                <div className="space-y-2">
                  {competitorAnalysis.competitiveAdvantages?.map((adv, idx) => (
                    <div key={idx} className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="font-medium text-sm text-gray-800">{adv.aspect}</p>
                      <p className="text-xs text-gray-600">{adv.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">📍 市場ポジション</h3>
                <p className="text-sm text-gray-700">{competitorAnalysis.marketPosition}</p>
              </div>
            </>
          )}
        </>
      )}

      <AdBanner position="bottom" />
    </div>
  );
};

// ========== プロフィール画面 ==========
const ProfileScreen = ({ shop, onLogout }) => {
  const myShop = shop || {
    shop_name: "居酒屋 さくら",
    owner_name: "山田 太郎",
    email: "yamada@example.com",
    phone: "06-1234-5678",
    category: "居酒屋",
    station: "梅田駅",
  };

  const handleLogout = async () => {
    try {
      if (window.TonarinoDB && window.CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        await window.TonarinoDB.Auth.signOut();
      }
      onLogout();
    } catch (err) {
      console.error('Logout error:', err);
      onLogout();
    }
  };

  return (
    <div className="space-y-4">
      <AdBanner position="top" />

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{myShop.shop_name?.charAt(0) || 'T'}</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">{myShop.shop_name}</h2>
            <p className="text-sm text-gray-500">{myShop.station || '未設定'}周辺</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b"><span className="text-gray-500">オーナー</span><span className="font-medium">{myShop.owner_name}</span></div>
          <div className="flex justify-between py-2 border-b"><span className="text-gray-500">メール</span><span className="font-medium">{myShop.email}</span></div>
          <div className="flex justify-between py-2 border-b"><span className="text-gray-500">電話</span><span className="font-medium">{myShop.phone}</span></div>
          <div className="flex justify-between py-2 border-b"><span className="text-gray-500">業態</span><span className="font-medium">{myShop.category}</span></div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 border border-red-300 text-red-500 rounded-lg font-medium"
        >
          ログアウト
        </button>
      </div>

      <AdBanner position="bottom" />
    </div>
  );
};

// ========== メインアプリ ==========
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初期化・セッションチェック
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (window.TonarinoDB && window.CONFIG && window.CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
          const currentUser = await window.TonarinoDB.Auth.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            const myShop = await window.TonarinoDB.ShopService.getMyShop();
            setShop(myShop);
            setCurrentScreen(myShop ? 'main' : 'registerShop');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };

    // 少し遅延させてconfig.jsの読み込みを待つ
    setTimeout(checkSession, 100);
  }, []);

  const handleLogin = async () => {
    try {
      if (window.TonarinoDB && window.CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        const currentUser = await window.TonarinoDB.Auth.getCurrentUser();
        setUser(currentUser);
        const myShop = await window.TonarinoDB.ShopService.getMyShop();
        setShop(myShop);
        setCurrentScreen(myShop ? 'main' : 'registerShop');
      } else {
        // デモモード
        setCurrentScreen('registerShop');
      }
    } catch (err) {
      console.error('Post-login error:', err);
      setCurrentScreen('registerShop');
    }
  };

  const handleShopRegister = (shopData) => {
    setShop(shopData);
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    setUser(null);
    setShop(null);
    setCurrentScreen('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading message="読み込み中..." />
      </div>
    );
  }

  // 画面ルーティング
  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onRegister={() => setCurrentScreen('signUp')}
      />
    );
  }

  if (currentScreen === 'signUp') {
    return (
      <SignUpScreen
        onSignUp={() => setCurrentScreen('registerShop')}
        onBack={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'registerShop') {
    return (
      <RegisterShopScreen
        onRegister={handleShopRegister}
        onBack={user ? null : () => setCurrentScreen('login')}
      />
    );
  }

  // メイン画面
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 max-w-lg mx-auto">
        {activeTab === 'home' && <Dashboard shop={shop} />}
        {activeTab === 'ranking' && <RankingScreen />}
        {activeTab === 'analysis' && <AnalysisScreen shop={shop} />}
        {activeTab === 'profile' && <ProfileScreen shop={shop} onLogout={handleLogout} />}
      </div>

      {/* ボトムナビ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around max-w-lg mx-auto">
          {[
            { id: 'home', icon: <Icons.Home />, label: 'ホーム' },
            { id: 'ranking', icon: <Icons.Trophy />, label: 'ランキング' },
            { id: 'analysis', icon: <Icons.LightBulb />, label: '課題分析' },
            { id: 'profile', icon: <Icons.User />, label: 'アカウント' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// レンダリング
ReactDOM.createRoot(document.getElementById('app')).render(<App />);
