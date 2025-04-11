import { Transaction } from '../types/transaction.types';

// Helper functions for data analysis
export const getTopExpenseCategories = (transactions: Transaction[], limit: number = 5): Array<{category: string, amount: number}> => {
  const categories: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === 'Expense')
    .forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = 0;
      }
      categories[t.category] += Number(t.amount) || 0;
    });
  
  return Object.entries(categories)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

// Get icon based on category name
export const getCategoryIcon = (category?: string) => {
    if (!category) {
      console.error("getCategoryIcon received an undefined category");
      return 'Category'; // Default fallback icon
    }
    
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('food') || lowerCategory.includes('grocery') || lowerCategory.includes('restaurant')) {
      return 'Fastfood';
    } else if (lowerCategory.includes('shop') || lowerCategory.includes('cloth')) {
      return 'ShoppingBag';
    } else if (lowerCategory.includes('car') || lowerCategory.includes('gas') || lowerCategory.includes('transport')) {
      return 'DirectionsCar';
    } else if (lowerCategory.includes('health') || lowerCategory.includes('medical')) {
      return 'LocalHospital';
    } else {
      return 'Category';
    }
  };
  