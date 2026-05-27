import React, { useState, useEffect } from 'react';

const CATEGORIES = ['General', 'Personal', 'Auto', 'House'];

function App() {
  const [spendings, setSpendings] = useState(() => {
    try {
      const saved = localStorage.getItem('spendings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    category: 'General',
    amount: '',
    currency: 'MXN',
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('spendings', JSON.stringify(spendings));
  }, [spendings]);

  const handleInputChange = (field, value) => {
    if (field === 'amount') {
      const numericValue = value.replace(/[^0-9.]/g, '');
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        return;
      }
      setFormData(prev => ({ ...prev, amount: numericValue }));
    } else if (field === 'note') {
      if (value.length <= 140) {
        setFormData(prev => ({ ...prev, note: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleCurrency = () => {
    setFormData(prev => ({
      ...prev,
      currency: prev.currency === 'MXN' ? 'USD' : 'MXN'
    }));
  };

  const addSpending = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newSpending = {
      id: Date.now(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      note: formData.note.trim(),
      date: new Date().toLocaleDateString()
    };

    setSpendings(prev => [newSpending, ...prev]);

    setFormData({
      category: 'General',
      amount: '',
      currency: 'MXN',
      note: ''
    });
  };

  const deleteSpending = (id) => {
    setSpendings(prev => prev.filter(s => s.id !== id));
  };

  const formatAmount = (amount, currency) => {
    return `$${amount.toFixed(2)} ${currency}`;
  };

  const filteredSpendings = spendings
    .filter(spending => filterCategory === 'All' || spending.category === filterCategory)
    .filter(spending => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        spending.note.toLowerCase().includes(q) ||
        spending.category.toLowerCase().includes(q)
      );
    });

  const getTotalByCategory = (category) => {
    const categorySpending = category === 'All'
      ? spendings
      : spendings.filter(spending => spending.category === category);

    return categorySpending.reduce((total, spending) => total + spending.amount, 0);
  };

  const isFormValid = formData.amount && parseFloat(formData.amount) > 0;

  return (
    <div className="container">
      <div className="header">
        <h1>💰 Spending Tracker</h1>
        <p>Track your expenses easily</p>
      </div>

      {/* Add Spending Form */}
      <div className="card">
        <h2>Add New Spending</h2>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            data-testid="category-select"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <div className="amount-input">
            <input
              id="amount"
              type="text"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              style={{ paddingLeft: '20px' }}
              data-testid="amount-input"
            />
            <button
              type="button"
              className="currency-toggle"
              onClick={toggleCurrency}
              data-testid="currency-toggle"
            >
              {formData.currency}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (optional)</label>
          <textarea
            id="note"
            placeholder="Add a note about this spending..."
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            rows="3"
            data-testid="note-input"
          />
          <div className={`char-count ${formData.note.length > 130 ? 'warning' : ''}`}>
            {formData.note.length}/140
          </div>
        </div>

        <button
          className="add-btn"
          onClick={addSpending}
          disabled={!isFormValid}
          data-testid="add-spending-btn"
        >
          Add Spending
        </button>
      </div>

      {/* Spending Filter and List */}
      <div className="card">
        <div className="spending-header">
          <h2>Your Spendings</h2>

          {spendings.length > 0 && (
            <div className="filter-section">
              <div className="filter-controls">
                <label htmlFor="filter">Filter by Category:</label>
                <select
                  id="filter"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                  data-testid="category-filter"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-controls">
                <input
                  type="text"
                  placeholder="Search spendings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="search-input"
                />
              </div>

              <div className="total-display">
                <strong>
                  Total ({filterCategory}): {formatAmount(getTotalByCategory(filterCategory), 'MXN')}
                </strong>
              </div>
            </div>
          )}
        </div>

        {filteredSpendings.length === 0 ? (
          <div className="empty-state">
            {spendings.length === 0 ? (
              <p>No spendings yet. Add your first spending above!</p>
            ) : (
              <p>No spendings found for "{filterCategory}" category.</p>
            )}
          </div>
        ) : (
          <>
            {filteredSpendings.map(spending => (
              <div key={spending.id} className="spending-item" data-testid="spending-item">
                <div className="spending-category">
                  {spending.category}
                </div>
                <div className="spending-amount">
                  {formatAmount(spending.amount, spending.currency)}
                </div>
                {spending.note && (
                  <div className="spending-note">
                    "{spending.note}"
                  </div>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteSpending(spending.id)}
                  data-testid="delete-spending-btn"
                  aria-label="Delete spending"
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
