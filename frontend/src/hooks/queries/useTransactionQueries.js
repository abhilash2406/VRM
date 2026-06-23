import { useQuery } from '@tanstack/react-query';
import { getData } from '../../services';

export const transactionKeys = {
  all: ['transactions'],
};

export const useAllTransactions = () => {
  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: async () => {
      const { data } = await getData('/transactions');
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};
