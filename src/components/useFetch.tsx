import {useAuth} from 'context';
import useSWR from 'swr';

type useFetch = (
  key: string,
  fn: (...args: any) => any[] | Promise<any[]>,
) => ReturnType<typeof useSWR>;

export const useFetch = (
  key: string | any[] | null,
  fn: (...args: any) => any[] | Promise<any[]>,
): ReturnType<typeof useSWR> => {
  const {currentUser} = useAuth();

  if (key) {
    if (currentUser) {
      if (Array.isArray(key)) key.push(currentUser.userId);
      else key = [key, currentUser.userId];
    }
  }

  return useSWR([], fn);
};
