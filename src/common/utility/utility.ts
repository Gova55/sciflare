export const Pagination = (page: number, data: any[], totalCount: number) => {
    const from: number = page < 1 ? 1 : (page - 1) * 10 + 1;
    const to: number = page == 0 ? 0 : (page - 1) * 10 + data.length;
    const totalPages: number = totalCount == 0 ? 0 : Math.ceil(totalCount / 10);
  
    return { data, from, to, totalPages, totalCount };
  };
 
  