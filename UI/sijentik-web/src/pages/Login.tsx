import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';
export default function Login() {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [role, setRole] = useState('SURVEYOR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        name,
        access_code: accessCode,
        role,
      });

      const { access_token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-screen w-full font-body antialiased bg-background-light">
      {/* Left Section: Authentication Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-6 lg:p-12 xl:p-20 bg-white relative z-10 shadow-xl lg:shadow-none">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2 bg-slate-50">
              <span className="material-symbols-outlined text-4xl text-primary">pest_control</span>
            </div>
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-main tracking-tight">
                Sistem Informasi Surveilans Jentik
              </h1>
              <p className="text-text-muted text-sm mt-1">Kabupaten Sikka, NTT</p>
            </div>
          </div>
          
          <form className="flex flex-col gap-5 mt-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            {/* Role Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-main" htmlFor="role">
                Pilih Role
              </label>
              <div className="relative z-20">
                <Select
                  options={[
                    { value: 'ADMIN', label: 'Admin' },
                    { value: 'HEALTHCARE_MANAGER', label: 'Puskesmas Manager' },
                    { value: 'SURVEYOR', label: 'Petugas Survey (Kader)' }
                  ]}
                  value={{ 
                    value: role, 
                    label: role === 'ADMIN' ? 'Admin' : role === 'HEALTHCARE_MANAGER' ? 'Puskesmas Manager' : role === 'SURVEYOR' ? 'Petugas Survey (Kader)' : 'ANDA ADALAH...' 
                  }}
                  onChange={(selected: any) => setRole(selected?.value || '')}
                  styles={selectCustomStyles}
                  isSearchable={false}
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-sm font-semibold text-text-main" htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-text-muted text-xl group-focus-within:text-primary transition-colors">
                    person
                  </span>
                </div>
                <input
                  className="w-full pl-10 pr-3 py-3 bg-white border border-border-subtle rounded-sm text-text-main placeholder:text-text-muted/60 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none"
                  id="name"
                  name="name"
                  placeholder="Masukan Nama Lengkap Anda"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Access Code Input */}
            <div className="flex flex-col gap-1.5 group">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-text-main" htmlFor="accessCode">
                  Kode Akses
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-text-muted text-xl group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                </div>
                <input
                  className="w-full pl-10 pr-10 py-3 bg-white border border-border-subtle rounded-sm text-text-main placeholder:text-text-muted/60 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none"
                  id="accessCode"
                  name="accessCode"
                  placeholder="Masukan Kode Akses"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main cursor-pointer outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Access Button */}
            <button
              className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-heading font-semibold py-3.5 px-4 rounded-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? 'MEMPROSES...' : 'MASUK'}</span>
              {!loading && <span className="material-symbols-outlined text-lg">login</span>}
            </button>

            {/* Footer Links */}
            <div className="flex justify-between items-center mt-4 text-xs">
              <a className="text-primary hover:text-primary-dark font-medium hover:underline" href="#">
                Lupa Kode Akses?
              </a>
              <a className="text-text-muted hover:text-text-main transition-colors flex items-center gap-1" href="#">
                <span className="material-symbols-outlined text-sm">support</span>
                Hubungi Bantuan
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section: Visual Hero */}
      <div className="hidden lg:flex w-[60%] relative bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <img
          alt="Abstract medical laboratory background with clean surfaces and blue lighting representing sterile clinical environment"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdfYNXxAH5Yb6YBssIARn_OA8BDsWIUr_62Pyq_gLbwADMtD7py4WaZwCFR9GvaTni6ip5SFoTJOQFWgLw7LIHxmJA8W5IFibOKX4SrvHTQKOnbfH9BxcooQyxCgkJszaD-NWLcgyh6RKD2CG12a9mRaUCMfFFIAgniRV8mIviJfGUlAu1DqTTwN0Qdt1DXK2NDsJvTlIQprub-_QwdQqecsA6bcQvmKoHeHTwWhreQH7Cqw0htpbo-YflkAZ-c7l_qDd-OC4lwAI"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/90 to-slate-900/90 mix-blend-multiply"></div>
        {/* Pattern Overlay (Subtle Grid) */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        ></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-16 h-full w-full text-white">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-white/60"></div>
              <span className="text-sm font-mono tracking-widest uppercase text-white/80">SIJENTIK</span>
            </div>
            <h2 className="font-heading text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Surveilans Jentik Nyamuk Aedes Aegypti di Kabupaten Sikka, NTT
            </h2>
            <p className="text-lg text-white/80 font-light leading-relaxed max-w-xl border-l-2 border-primary pl-6">
              Admin, Puskesmas Manager, Petugas Survey.
            </p>
          </div>
          
          {/* Decorative Map Graphic Suggestion */}
          <div className="absolute top-12 right-12 w-64 h-64 opacity-20 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,54.6,19.1C51.8,30.2,42.2,40.4,31.6,48.1C21,55.8,9.4,61,-2.9,65C-15.2,69,-28.1,71.8,-39.8,65.3C-51.5,58.8,-61.9,43,-68.6,26.4C-75.3,9.8,-78.2,-7.6,-71.4,-21.8C-64.6,-36,-48,-47,-33.4,-54.2C-18.8,-61.4,-6.2,-64.8,5.4,-72.2L17,-79.6L42.7,-62.9Z"
                fill="#FFFFFF"
                transform="translate(100 100)"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
