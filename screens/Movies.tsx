import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Dimensions, FlatList } from "react-native";
import Swiper from "react-native-swiper";
import { useQuery, useQueryClient, useInfiniteQuery } from "react-query";
import styled from "styled-components/native";
import { MovieResponse, moviesApi } from "../api";
import HList from "../components/HList";
import HMedia from "../components/HMedia";
import Loader from "../components/Loader";
import Slider from "../components/Slider";
import VMedia from "../components/VMedia";

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const VSeparator = styled.View`
  width: 20px;
`;
const HSeparator = styled.View`
  height: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading: nowPlayingLoading, data: nowPlayingData } =
    useQuery<MovieResponse>(["movies", "nowPlaying"], moviesApi.nowPlaying);
  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "trending"],
    moviesApi.trending,
    {
      getNextPageParam: (currentPage) => {
        const nextPage = currentPage.page + 1;
        return nextPage > currentPage.total_pages ? null : nextPage;
      },
    }
  );
  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage: upcomingHasNextPage,
    fetchNextPage: upcomingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "upcoming"],
    moviesApi.upcoming,
    {
      getNextPageParam: (currentPage) => {
        const nextPage = currentPage.page + 1;
        return nextPage > currentPage.total_pages ? null : nextPage;
      },
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["movies"]);
    setRefreshing(false);
  };

  const loading = nowPlayingLoading || trendingLoading || upcomingLoading;

  const upComingLoadMore = () => {
    if (upcomingHasNextPage) {
      upcomingFetchNextPage();
    }
  };

  const trendingLoadMore = () => {
    if (trendingHasNextPage) {
      trendingFetchNextPage();
    }
  };

  return loading ? (
    <Loader />
  ) : upcomingData ? (
    <FlatList
      onEndReached={upComingLoadMore}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{
              width: "100%",
              height: SCREEN_HEIGHT / 4,
              marginBottom: 40,
            }}
          >
            {nowPlayingData?.results.map((movie) => (
              <Slider
                key={movie.id}
                backdropPath={movie.backdrop_path || ""}
                posterPath={movie.poster_path || ""}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
                fullData={movie}
              />
            ))}
          </Swiper>
          {trendingData ? (
            <HList
              title="Trending Movies"
              data={trendingData.pages.map((page) => page.results).flat()}
              onEndReached={trendingLoadMore}
            />
          ) : null}

          <ComingSoonTitle>Coming Soon</ComingSoonTitle>
        </>
      }
      data={upcomingData.pages.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HSeparator}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
          fullData={item}
        />
      )}
    ></FlatList>
  ) : null;
};

export default Movies;
