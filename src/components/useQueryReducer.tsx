import {useReducer} from 'react';

interface RType {
  query: State;
  filter: (by: string) => void;
  order: (by: string) => void;
  prev: () => void;
  next: () => void;
  setLimit: (limit: number) => void;
}

type State = {filter?: string; order?: string; offset?: number; limit?: number};
type Action =
  | {type: 'filter'; by: string}
  | {type: 'prev'} // pagination
  | {type: 'next'} // pagination
  | {type: 'setLimit'; limit: number}
  | {type: 'order'; by: string};

export const useQueryReducer = (
  init: State = {offset: 0, limit: 10},
): RType => {
  const reducer = (query: State, action: Action) => {
    switch (action.type) {
      case 'filter': {
        return action.by ? {...query, filter: action.by} : query;
      }
      case 'order': {
        return action.by ? {...query, order: action.by} : query;
      }
      case 'prev': {
        let offset = query.offset - query.limit;
        if (offset < 0) offset = 0;
        return {...query, offset};
      }
      case 'next': {
        return {...query, offset: query.offset + query.limit};
      }
      case 'setLimit': {
        let limit = action.limit;
        if (limit < 1) limit = 1;
        return {...query, limit};
      }
    }
  };

  const [query, dispatch] = useReducer(reducer, init);

  return {
    query,
    filter: (by) => dispatch({type: 'filter', by}),
    order: (by) => dispatch({type: 'order', by}),
    prev: () => dispatch({type: 'prev'}),
    next: () => dispatch({type: 'next'}),
    setLimit: (limit) => dispatch({type: 'setLimit', limit}),
  };
};
