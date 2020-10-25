const get = (id) => {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then((response) =>
    response.json()
  );
};
get.success = (state, action) => action.id;

export const ItemStore = {
  name: "item",
  initialState: null,
  actions: { get },
};
