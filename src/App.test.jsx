import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from './App'

describe('Spending Tracker App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Initial Render', () => {
    it('renders the app title and form elements', () => {
      render(<App />)

      expect(screen.getByText('💰 Spending Tracker')).toBeInTheDocument()
      expect(screen.getByText('Track your expenses easily')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
      expect(screen.getByLabelText('Amount')).toBeInTheDocument()
      expect(screen.getByLabelText('Note (optional)')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add Spending' })).toBeInTheDocument()
    })

    it('shows empty state message when no spendings exist', () => {
      render(<App />)

      expect(screen.getByText('No spendings yet. Add your first spending above!')).toBeInTheDocument()
    })

    it('has default form values', () => {
      render(<App />)

      expect(screen.getByDisplayValue('General')).toBeInTheDocument()
      expect(screen.getByTestId('currency-toggle')).toHaveTextContent('MXN')
      expect(screen.getByPlaceholderText('0.00')).toHaveValue('')
      expect(screen.getByPlaceholderText('Add a note about this spending...')).toHaveValue('')
    })
  })

  describe('Form Interactions', () => {
    it('allows category selection', async () => {
      const user = userEvent.setup()
      render(<App />)

      const categorySelect = screen.getByTestId('category-select')
      await user.selectOptions(categorySelect, 'Personal')

      expect(categorySelect).toHaveValue('Personal')
    })

    it('allows currency toggle', async () => {
      const user = userEvent.setup()
      render(<App />)

      const currencyToggle = screen.getByTestId('currency-toggle')
      expect(currencyToggle).toHaveTextContent('MXN')

      await user.click(currencyToggle)
      expect(currencyToggle).toHaveTextContent('USD')

      await user.click(currencyToggle)
      expect(currencyToggle).toHaveTextContent('MXN')
    })

    it('allows note input with character limit', async () => {
      const user = userEvent.setup()
      render(<App />)

      const noteInput = screen.getByTestId('note-input')
      const shortNote = 'Short note'

      await user.type(noteInput, shortNote)
      expect(noteInput).toHaveValue(shortNote)
      expect(screen.getByText(`${shortNote.length}/140`)).toBeInTheDocument()
    })

    it('prevents note input beyond 140 characters', async () => {
      const user = userEvent.setup()
      render(<App />)

      const noteInput = screen.getByTestId('note-input')
      const longNote = 'a'.repeat(150)

      await user.type(noteInput, longNote)
      expect(noteInput.value.length).toBe(140)
      expect(screen.getByText('140/140')).toBeInTheDocument()
    })

    it('shows warning when approaching character limit', async () => {
      const user = userEvent.setup()
      render(<App />)

      const noteInput = screen.getByTestId('note-input')
      const longNote = 'a'.repeat(135)

      await user.type(noteInput, longNote)

      const charCount = screen.getByText('135/140')
      expect(charCount).toHaveClass('warning')
    })
  })

  describe('Amount Input Validation', () => {
    it('allows numeric input only', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')

      await user.type(amountInput, 'abc123.45def')
      expect(amountInput).toHaveValue('123.45')
    })

    it('prevents multiple decimal points', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')

      await user.type(amountInput, '123.45')
      // Typing a second decimal point should be rejected
      await user.type(amountInput, '.')
      expect(amountInput).toHaveValue('123.45')
    })

    it('disables add button when amount is empty', () => {
      render(<App />)

      const addButton = screen.getByTestId('add-spending-btn')
      expect(addButton).toBeDisabled()
    })

    it('disables add button when amount is zero', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '0')
      expect(addButton).toBeDisabled()
    })

    it('enables add button when valid amount is entered', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '25.50')
      expect(addButton).toBeEnabled()
    })
  })

  describe('Adding Spendings', () => {
    it('adds a new spending when form is valid', async () => {
      const user = userEvent.setup()
      render(<App />)

      const categorySelect = screen.getByTestId('category-select')
      const amountInput = screen.getByTestId('amount-input')
      const noteInput = screen.getByTestId('note-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.selectOptions(categorySelect, 'Personal')
      await user.type(amountInput, '50.75')
      await user.type(noteInput, 'Coffee and lunch')
      await user.click(addButton)

      const spendingItem = screen.getByTestId('spending-item')
      expect(within(spendingItem).getByText('Personal')).toBeInTheDocument()
      expect(screen.getByText('$50.75 MXN')).toBeInTheDocument()
      expect(screen.getByText('"Coffee and lunch"')).toBeInTheDocument()
    })

    it('resets form after adding spending', async () => {
      const user = userEvent.setup()
      render(<App />)

      const categorySelect = screen.getByTestId('category-select')
      const amountInput = screen.getByTestId('amount-input')
      const noteInput = screen.getByTestId('note-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.selectOptions(categorySelect, 'Auto')
      await user.type(amountInput, '100.00')
      await user.type(noteInput, 'Gas')
      await user.click(addButton)

      expect(categorySelect).toHaveValue('General')
      expect(amountInput).toHaveValue('')
      expect(noteInput).toHaveValue('')
      expect(screen.getByText('0/140')).toBeInTheDocument()
    })

    it('shows alert for invalid amount', async () => {
      render(<App />)

      const addButton = screen.getByTestId('add-spending-btn')

      fireEvent.click(addButton)

      expect(global.alert).not.toHaveBeenCalled()
    })

    it('adds spending with different currency', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const currencyToggle = screen.getByTestId('currency-toggle')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '25.00')
      await user.click(currencyToggle)
      await user.click(addButton)

      expect(screen.getByText('$25.00 USD')).toBeInTheDocument()
    })

    it('resets currency to MXN after adding spending', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const currencyToggle = screen.getByTestId('currency-toggle')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '25.00')
      await user.click(currencyToggle)
      await user.click(addButton)

      expect(currencyToggle).toHaveTextContent('MXN')
    })

    it('trims whitespace from note before saving', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const noteInput = screen.getByTestId('note-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '10.00')
      await user.type(noteInput, '  trimmed  ')
      await user.click(addButton)

      expect(screen.getByText('"trimmed"')).toBeInTheDocument()
    })

    it('adds multiple spendings in reverse chronological order', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '10.00')
      await user.click(addButton)

      await user.type(amountInput, '20.00')
      await user.click(addButton)

      const items = screen.getAllByTestId('spending-item')
      expect(items[0]).toHaveTextContent('$20.00 MXN')
      expect(items[1]).toHaveTextContent('$10.00 MXN')
    })
  })

  describe('Category Filter', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const categorySelect = screen.getByTestId('category-select')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '10.00')
      await user.click(addButton)

      await user.selectOptions(categorySelect, 'Personal')
      await user.type(amountInput, '20.00')
      await user.click(addButton)

      await user.selectOptions(categorySelect, 'Auto')
      await user.type(amountInput, '30.00')
      await user.click(addButton)
    })

    it('shows filter dropdown when spendings exist', () => {
      expect(screen.getByTestId('category-filter')).toBeInTheDocument()
      expect(screen.getByText('Filter by Category:')).toBeInTheDocument()
    })

    it('shows all spendings by default', () => {
      const spendingItems = screen.getAllByTestId('spending-item')
      expect(spendingItems).toHaveLength(3)
    })

    it('filters spendings by selected category', async () => {
      const user = userEvent.setup()
      const filterSelect = screen.getByTestId('category-filter')

      await user.selectOptions(filterSelect, 'Personal')

      const spendingItems = screen.getAllByTestId('spending-item')
      expect(spendingItems).toHaveLength(1)
      expect(screen.getByText('$20.00 MXN')).toBeInTheDocument()
    })

    it('shows empty state when no spendings match filter', async () => {
      const user = userEvent.setup()
      const filterSelect = screen.getByTestId('category-filter')

      await user.selectOptions(filterSelect, 'House')

      expect(screen.queryAllByTestId('spending-item')).toHaveLength(0)
      expect(screen.getByText('No spendings found for "House" category.')).toBeInTheDocument()
    })

    it('shows correct total for filtered category', async () => {
      const user = userEvent.setup()
      const filterSelect = screen.getByTestId('category-filter')

      await user.selectOptions(filterSelect, 'Auto')

      expect(screen.getByText('Total (Auto): $30.00 MXN')).toBeInTheDocument()
    })

    it('shows correct total for all categories', () => {
      expect(screen.getByText('Total (All): $60.00 MXN')).toBeInTheDocument()
    })
  })

  describe('Spending Display', () => {
    it('displays spending information correctly', async () => {
      const user = userEvent.setup()
      render(<App />)

      const categorySelect = screen.getByTestId('category-select')
      const amountInput = screen.getByTestId('amount-input')
      const noteInput = screen.getByTestId('note-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.selectOptions(categorySelect, 'House')
      await user.type(amountInput, '150.25')
      await user.type(noteInput, 'Groceries and utilities')
      await user.click(addButton)

      const spendingItem = screen.getByTestId('spending-item')

      expect(within(spendingItem).getByText('House')).toBeInTheDocument()
      expect(within(spendingItem).getByText('$150.25 MXN')).toBeInTheDocument()
      expect(within(spendingItem).getByText('"Groceries and utilities"')).toBeInTheDocument()
    })

    it('does not show note section when note is empty', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '25.00')
      await user.click(addButton)

      const spendingItem = screen.getByTestId('spending-item')

      expect(within(spendingItem).getByText('General')).toBeInTheDocument()
      expect(within(spendingItem).getByText('$25.00 MXN')).toBeInTheDocument()
      expect(spendingItem.querySelector('.spending-note')).not.toBeInTheDocument()
    })
  })

  describe('Delete Functionality', () => {
    it('shows a delete button for each spending item', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '50.00')
      await user.click(addButton)

      expect(screen.getByTestId('delete-spending-btn')).toBeInTheDocument()
    })

    it('removes a spending when delete is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '75.00')
      await user.click(addButton)

      await user.click(screen.getByTestId('delete-spending-btn'))

      expect(screen.queryByText('$75.00 MXN')).not.toBeInTheDocument()
    })

    it('shows empty state after deleting the only spending', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '10.00')
      await user.click(addButton)

      await user.click(screen.getByTestId('delete-spending-btn'))

      expect(screen.getByText('No spendings yet. Add your first spending above!')).toBeInTheDocument()
    })

    it('deletes only the targeted spending when multiple exist', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '10.00')
      await user.click(addButton)

      await user.type(amountInput, '20.00')
      await user.click(addButton)

      const deleteButtons = screen.getAllByTestId('delete-spending-btn')
      await user.click(deleteButtons[0])

      expect(screen.queryByText('$20.00 MXN')).not.toBeInTheDocument()
      expect(screen.getByText('$10.00 MXN')).toBeInTheDocument()
    })

    it('updates total after deleting a spending', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '30.00')
      await user.click(addButton)

      await user.type(amountInput, '20.00')
      await user.click(addButton)

      expect(screen.getByText('Total (All): $50.00 MXN')).toBeInTheDocument()

      const deleteButtons = screen.getAllByTestId('delete-spending-btn')
      await user.click(deleteButtons[0])

      expect(screen.getByText('Total (All): $30.00 MXN')).toBeInTheDocument()
    })
  })

  describe('localStorage Persistence', () => {
    it('saves spendings to localStorage when a spending is added', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '150.00')
      await user.click(addButton)

      const savedData = JSON.parse(localStorage.getItem('spendings'))
      expect(savedData).toHaveLength(1)
      expect(savedData[0].amount).toBe(150.00)
    })

    it('loads spendings from localStorage on mount', () => {
      const mockSpendings = [
        {
          id: 1,
          category: 'General',
          amount: 100.00,
          currency: 'MXN',
          note: 'Test spending',
          date: '1/1/2024'
        }
      ]
      localStorage.setItem('spendings', JSON.stringify(mockSpendings))

      render(<App />)

      expect(screen.getByText('$100.00 MXN')).toBeInTheDocument()
      expect(screen.getByText('"Test spending"')).toBeInTheDocument()
    })

    it('updates localStorage when a spending is deleted', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '50.00')
      await user.click(addButton)

      await user.click(screen.getByTestId('delete-spending-btn'))

      const savedData = JSON.parse(localStorage.getItem('spendings'))
      expect(savedData).toHaveLength(0)
    })

    it('handles corrupted localStorage data gracefully', () => {
      localStorage.setItem('spendings', 'not valid json {{{')

      expect(() => render(<App />)).not.toThrow()
      expect(screen.getByText('No spendings yet. Add your first spending above!')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const noteInput = screen.getByTestId('note-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '50.00')
      await user.type(noteInput, 'Grocery shopping')
      await user.click(addButton)

      await user.type(amountInput, '25.00')
      await user.type(noteInput, 'Gas station')
      await user.click(addButton)
    })

    it('shows a search input when spendings exist', () => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search spendings...')).toBeInTheDocument()
    })

    it('filters spendings by note content (case-insensitive)', async () => {
      const user = userEvent.setup()

      await user.type(screen.getByTestId('search-input'), 'grocery')

      expect(screen.getByText('"Grocery shopping"')).toBeInTheDocument()
      expect(screen.queryByText('"Gas station"')).not.toBeInTheDocument()
    })

    it('filters spendings by category name', async () => {
      const user = userEvent.setup()
      const categorySelect = screen.getByTestId('category-select')
      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.selectOptions(categorySelect, 'Personal')
      await user.type(amountInput, '15.00')
      await user.click(addButton)

      await user.type(screen.getByTestId('search-input'), 'personal')

      const items = screen.getAllByTestId('spending-item')
      expect(items).toHaveLength(1)
      expect(items[0]).toHaveTextContent('Personal')
    })

    it('shows all spendings when search query is cleared', async () => {
      const user = userEvent.setup()
      const searchInput = screen.getByTestId('search-input')

      await user.type(searchInput, 'grocery')
      expect(screen.getAllByTestId('spending-item')).toHaveLength(1)

      await user.clear(searchInput)
      expect(screen.getAllByTestId('spending-item')).toHaveLength(2)
    })

    it('shows no results message when search matches nothing', async () => {
      const user = userEvent.setup()

      await user.type(screen.getByTestId('search-input'), 'pizza')

      expect(screen.queryAllByTestId('spending-item')).toHaveLength(0)
    })
  })
})
