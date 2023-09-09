
  export const calculatePages = (total:number, limit:number) => {
    const displayPage = Math.floor(total / limit);
    return total % limit ? displayPage + 1 : displayPage;
  };
  