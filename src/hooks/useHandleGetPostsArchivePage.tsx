import {
  OrderEnum,
  PostObjectsConnectionOrderbyEnum,
} from "@/__generated__/graphql";
import { FILTERS_OPTIONS, GET_POSTS_FIRST_COMMON } from "@/contains/contants";
import { PostDataFragmentType } from "@/data/types";
import { QUERY_GET_POSTS_BY } from "@/fragments/queries";
import errorHandling from "@/utils/errorHandling";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState, useCallback } from "react";

interface Props {
  initPosts?: PostDataFragmentType[] | null;
  initPostsPageInfo?: {
    endCursor?: string | null | undefined;
    hasNextPage: boolean;
  } | null;
  tagDatabaseId?: number | null;
  categoryDatabaseId?: number | null;
  authorDatabaseId?: number | null;
  categorySlug?: string | null;
  search?: string | null;
}

interface PageCursor {
  cursor: string | null;
  posts: PostDataFragmentType[];
}

export default function useHandleGetPostsArchivePage(props: Props) {
  const {
    categoryDatabaseId,
    initPosts: posts,
    initPostsPageInfo,
    tagDatabaseId,
    authorDatabaseId,
    categorySlug,
    search,
  } = props;

  const [filterParam, setfilterParam] =
    useState<`${PostObjectsConnectionOrderbyEnum}/${OrderEnum}`>();

  const [refetchTimes, setRefetchTimes] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageHistory, setPageHistory] = useState<PageCursor[]>([
    { cursor: null, posts: posts || [] }
  ]);
  const [currentEndCursor, setCurrentEndCursor] = useState<string | null>(
    initPostsPageInfo?.endCursor || null
  );
  const [hasNextPage, setHasNextPage] = useState(!!initPostsPageInfo?.hasNextPage);

  const routerQueryFilter = filterParam;
  const [queryGetPostsByCategoryId, postsByCategoryIdResult] = useLazyQuery(
    QUERY_GET_POSTS_BY,
    {
      variables: {
        categoryId: categoryDatabaseId,
        categoryName: categorySlug,
        tagId: tagDatabaseId?.toString(),
        author: authorDatabaseId,
        search,
        first: GET_POSTS_FIRST_COMMON,
      },
      notifyOnNetworkStatusChange: true,
      context: {
        fetchOptions: {
          method: process.env.NEXT_PUBLIC_SITE_API_METHOD || "GET",
        },
      },
      onError: (error) => {
        if (refetchTimes > 3) {
          errorHandling(error);
          return;
        }
        setRefetchTimes(refetchTimes + 1);
        postsByCategoryIdResult.refetch();
      },
    }
  );

  function checkRouterQueryFilter() {
    if (!routerQueryFilter) {
      return false;
    }
    const [field, order] = routerQueryFilter?.split("/");
    return {
      field: field as PostObjectsConnectionOrderbyEnum,
      order: order as OrderEnum,
    };
  }

  // Reset pagination when filter changes
  useEffect(() => {
    if (!routerQueryFilter) {
      return;
    }
    const fiterValue = checkRouterQueryFilter();
    if (!fiterValue) {
      return;
    }

    // Reset to page 1 with new filter
    setCurrentPage(1);
    setPageHistory([{ cursor: null, posts: [] }]);
    
    queryGetPostsByCategoryId({
      variables: {
        first: GET_POSTS_FIRST_COMMON,
        after: "",
        field: fiterValue.field,
        order: fiterValue.order,
      },
    });
  }, [routerQueryFilter]);

  // Update page history when new data arrives
  useEffect(() => {
    if (postsByCategoryIdResult.data?.posts?.nodes) {
      const newPosts = postsByCategoryIdResult.data.posts.nodes as PostDataFragmentType[];
      const pageInfo = postsByCategoryIdResult.data.posts.pageInfo;
      
      setCurrentEndCursor(pageInfo?.endCursor || null);
      setHasNextPage(!!pageInfo?.hasNextPage);
      
      // Update current page in history
      setPageHistory(prev => {
        const updated = [...prev];
        if (updated[currentPage - 1]) {
          updated[currentPage - 1] = { 
            cursor: currentPage === 1 ? null : updated[currentPage - 2]?.cursor || null,
            posts: newPosts 
          };
        }
        return updated;
      });
    }
  }, [postsByCategoryIdResult.data, currentPage]);

  // Navigate to next page
  const handleClickNext = useCallback(() => {
    if (!hasNextPage) return;
    
    const nextPage = currentPage + 1;
    const fiterValue = checkRouterQueryFilter();
    
    // Save current cursor for this page before moving to next
    setPageHistory(prev => {
      const updated = [...prev];
      // Ensure we have an entry for the next page
      if (!updated[nextPage - 1]) {
        updated[nextPage - 1] = { cursor: currentEndCursor, posts: [] };
      }
      return updated;
    });
    
    setCurrentPage(nextPage);
    
    queryGetPostsByCategoryId({
      variables: {
        after: currentEndCursor,
        first: GET_POSTS_FIRST_COMMON,
        ...(fiterValue && { field: fiterValue.field, order: fiterValue.order }),
      },
    });
  }, [hasNextPage, currentPage, currentEndCursor, queryGetPostsByCategoryId]);

  // Navigate to previous page
  const handleClickPrev = useCallback(() => {
    if (currentPage <= 1) return;
    
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    
    // If we have cached posts for previous page, use them
    const cachedPage = pageHistory[prevPage - 1];
    if (cachedPage && cachedPage.posts.length > 0) {
      // Posts are already in history, just update cursor
      const prevCursor = prevPage > 1 ? pageHistory[prevPage - 2]?.cursor : null;
      setCurrentEndCursor(pageHistory[prevPage - 1]?.cursor || initPostsPageInfo?.endCursor || null);
      setHasNextPage(true); // We came from next page, so there's definitely a next
      return;
    }
    
    // Otherwise fetch the previous page
    const fiterValue = checkRouterQueryFilter();
    const prevCursor = prevPage === 1 ? "" : (pageHistory[prevPage - 2]?.cursor || "");
    
    queryGetPostsByCategoryId({
      variables: {
        after: prevCursor,
        first: GET_POSTS_FIRST_COMMON,
        ...(fiterValue && { field: fiterValue.field, order: fiterValue.order }),
      },
    });
  }, [currentPage, pageHistory, queryGetPostsByCategoryId, initPostsPageInfo]);

  const handleChangeFilterPosts = (item: (typeof FILTERS_OPTIONS)[number]) => {
    setfilterParam(item.value);
  };

  // Determine current posts to display
  let loading = postsByCategoryIdResult.loading;
  let currentPosts: PostDataFragmentType[] = [];
  
  // Get posts for current page
  if (postsByCategoryIdResult.called && postsByCategoryIdResult.data?.posts?.nodes) {
    currentPosts = postsByCategoryIdResult.data.posts.nodes as PostDataFragmentType[];
  } else if (pageHistory[currentPage - 1]?.posts.length > 0) {
    currentPosts = pageHistory[currentPage - 1].posts;
  } else if (currentPage === 1 && posts) {
    currentPosts = posts;
  }

  // Show initial posts during first filter load
  if (!currentPosts.length && loading && filterParam === "DATE/DESC" && posts) {
    currentPosts = posts;
  }

  const hasPrevPage = currentPage > 1;

  return {
    loading,
    currentPosts,
    hasNextPage,
    hasPrevPage,
    currentPage,
    handleClickNext,
    handleClickPrev,
    handleChangeFilterPosts,
    // Legacy support - keeping for backwards compatibility
    handleClickShowMore: handleClickNext,
  };
}
