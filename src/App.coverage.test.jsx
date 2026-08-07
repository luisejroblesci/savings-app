import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from './App'

describe('App coverage — additional branch coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Note trimming & spending order', () => {
    it('trims leading and trailing whitespace from note', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByTestId('amount-input'), '10.00')
      await user.type(screen.getByTestId('note-input'), '  Gas  ')
      await user.click(screen.getByTestId('add-spending-btn'))

      expect(screen.getByText('"Gas"')).toBeInTheDocument()
    })

    it('new spendings appear at the top of the list', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.type(amountInput, '10.00')
      await user.click(addButton)

      await user.type(amountInput, '99.00')
      await user.click(addButton)

      const items = screen.getAllByTestId('spending-item')
      expect(items[0]).toHaveTextContent('$99.00 MXN')
    })
  })

  describe('Currency reset after adding', () => {
    it('currency toggle resets to MXN after adding a spending', async () => {
      const user = userEvent.setup()
      render(<App />)

      const currencyToggle = screen.getByTestId('currency-toggle')
      await user.click(currencyToggle) // MXN → USD
      expect(currencyToggle).toHaveTextContent('USD')

      await user.type(screen.getByTestId('amount-input'), '50.00')
      await user.click(screen.getByTestId('add-spending-btn'))

      expect(currencyToggle).toHaveTextContent('MXN')
    })
  })

  describe('Char-count warning threshold boundary', () => {
    it('char-count has no warning class at exactly 130 characters', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByTestId('note-input'), 'a'.repeat(130))

      const counter = screen.getByText('130/140')
      expect(counter).not.toHaveClass('warning')
    })

    it('char-count gains warning class at 131 characters', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByTestId('note-input'), 'a'.repeat(131))

      const counter = screen.getByText('131/140')
      expect(counter).toHaveClass('warning')
    })
  })

  describe('Filter section visibility', () => {
    it('filter section is not shown when there are no spendings', () => {
      render(<App />)

      expect(screen.queryByTestId('category-filter')).not.toBeInTheDocument()
    })
  })

  describe('Category totals', () => {
    it('category total only sums matching category', async () => {
      const user = userEvent.setup()
      render(<App />)

      const categorySelect = screen.getByTestId('category-select')
      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.selectOptions(categorySelect, 'Personal')
      await user.type(amountInput, '20.00')
      await user.click(addButton)

      await user.selectOptions(categorySelect, 'Auto')
      await user.type(amountInput, '50.00')
      await user.click(addButton)

      await user.selectOptions(screen.getByTestId('category-filter'), 'Auto')

      expect(screen.getByText('Total (Auto): $50.00 MXN')).toBeInTheDocument()
    })

    it('All total sums all spendings regardless of category', async () => {
      const user = userEvent.setup()
      render(<App />)

      const categorySelect = screen.getByTestId('category-select')
      const amountInput = screen.getByTestId('amount-input')
      const addButton = screen.getByTestId('add-spending-btn')

      await user.selectOptions(categorySelect, 'Personal')
      await user.type(amountInput, '20.00')
      await user.click(addButton)

      await user.selectOptions(categorySelect, 'Auto')
      await user.type(amountInput, '50.00')
      await user.click(addButton)

      expect(screen.getByText('Total (All): $70.00 MXN')).toBeInTheDocument()
    })
  })
})
