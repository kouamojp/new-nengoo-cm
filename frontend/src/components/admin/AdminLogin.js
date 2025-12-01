
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminMockData } from '../../lib/mockData';

const AdminLogin = (props) => {
  const { setUser } = props;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    whatsapp: '',
    accessCode: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.whatsapp === adminMockData.adminCredentials.whatsapp && 
        formData.accessCode === adminMockData.adminCredentials.accessCode) {
      
      const adminUser = {
        id: 'admin',
        name: 'Administrateur',
        whatsapp: formData.whatsapp,
        type: 'admin',
        joinDate: '2024-01-01'
      };
      
      setUser(adminUser);
      localStorage.setItem('nengoo-user', JSON.stringify(adminUser));
      navigate('/admin/dashboard');
    } else {
      setError('Identifiants administrateur incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <img 
              src="/images/logo-nengoo.png" 
              alt="Nengoo Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Accès Administrateur</h1>
            <p className="text-gray-600">Connectez-vous pour gérer Nengoo</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro WhatsApp Administrateur
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="+237 XXX XXX XXX"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code d'accès
              </label>
              <input
                type="password"
                name="accessCode"
                value={formData.accessCode}
                onChange={handleInputChange}
                placeholder="Entrez le code d'accès"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-gray-600 hover:text-gray-700 text-sm">
              ← Retour à l'accueil
            </Link>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 text-center">
              🔒 Accès réservé aux administrateurs autorisés uniquement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
