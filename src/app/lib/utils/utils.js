export const chathrefconstructore = (id1, id2) => {
    const sortedIds = [id1, id2].sort();
    return `${sortedIds[0]}--${sortedIds[1]}`;
  };
  export const PusherKey = (key) =>{
    return key.replace(/:/g,'__')
  }