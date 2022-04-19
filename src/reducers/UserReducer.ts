export const USER = 'USER';

const initialState = {
  status: 0,
  info: '',
  data: [],
  user: null,
};
export default function LoginReducer(state = initialState, action: any) {
  switch (action.type) {
    case USER:
      return {
        ...state,
        user: {
          name: 'user',
        },
      };
    default:
      return Object.assign(state);
  }
}
