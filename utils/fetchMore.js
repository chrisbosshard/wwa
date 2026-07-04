// **************************************************
// getHasNextPage
// **************************************************
export const getHasNextPage = (data) => {
  return data.pageInfo.hasNextPage;
};

// **************************************************
// getAfter
// **************************************************
export const getAfter = (data) => {
  return data.edges && data.edges.length > 0 ? data.edges[data.edges.length - 1].cursor : null;
};

// **************************************************
// updateQuery
// **************************************************
export const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) return previousResult;
  const previousEdges = previousResult.connection.edges;
  const fetchMoreEdges = fetchMoreResult.connection.edges;
  fetchMoreResult.connection.edges = [...previousEdges, ...fetchMoreEdges];
  return { ...fetchMoreResult };
};
