import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useQueryClient, useInfiniteQuery } from "react-query";
import { tvApi, TVResponse } from "../api";
import HList from "../components/HList";
import Loader from "../components/Loader";

const Tv = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const {
    isLoading: todayLoading,
    data: todayData,
    hasNextPage: todayHasNextPage,
    fetchNextPage: todayFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "today"], tvApi.airingToday, {
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });
  const {
    isLoading: topLoading,
    data: topData,
    hasNextPage: topHasNextPage,
    fetchNextPage: topFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "top"], tvApi.topRated, {
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });
  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "trending"], tvApi.trending, {
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["tv"]);
    setRefreshing(false);
  };

  const loading = todayLoading || topLoading || trendingLoading;

  if (loading) {
    return <Loader />;
  }
  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 30 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {trendingData ? (
        <HList
          title="Trending TV"
          data={trendingData.pages.map((page) => page.results).flat()}
          onEndReached={trendingHasNextPage ? trendingFetchNextPage : null}
        />
      ) : null}

      {todayData ? (
        <HList
          title="Airing Today"
          data={todayData.pages.map((page) => page.results).flat()}
          onEndReached={todayHasNextPage ? todayFetchNextPage : null}
        />
      ) : null}

      {topData ? (
        <HList
          title="Top Rated TV"
          data={topData.pages.map((page) => page.results).flat()}
          onEndReached={topHasNextPage ? topFetchNextPage : null}
        />
      ) : null}
    </ScrollView>
  );
};

export default Tv;
