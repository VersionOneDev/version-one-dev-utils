const add = async (payload) => await payload;
add.success = (state, action) => [...state, action.payload];

export const CharactersStore = {
  name: "characters",
  initialState: ["Ryu", "Ken", "ChunLi"],
  actions: { add },
};
