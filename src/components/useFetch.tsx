import {useAuth} from 'context';
import useSWR from 'swr';

type Fetcher<Data> = (...args: any) => Data | Promise<Data>;
type Key = string | any[] | null;

export function useFetch<Data = any, Error = any>(
  key: Key,
  fn: Fetcher<Data> | null,
) {
  /**
   * To "separate" cache for different users after logout add currentUser.userId to each request
   */
  const {currentUser} = useAuth();

  if (key) {
    if (currentUser) {
      if (Array.isArray(key)) key.push(currentUser.userId);
      else key = [key, currentUser.userId];
    }
  }

  return useSWR<Data, Error>(key, fn);
}

export {mutate} from 'swr';
