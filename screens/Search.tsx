import { isLoaded, isLoading } from "expo-font";
import React, { useState } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import styled from "styled-components/native";
import { moviesApi, tvApi } from "../api";
import HList from "../components/HList";
import Loader from "../components/Loader";

const Container = styled.ScrollView``;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
`;

const Search = () => {
  const [query, setQuery] = useState("");
  const {
    isLoading: moviesLoading,
    data: moviesData,
    refetch: searchMovies,
    hasNextPage: movieHasNextPage,
    fetchNextPage: movieFetchNextPage,
  } = useInfiniteQuery(["searchMovies", query], moviesApi.search, {
    enabled: false,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });
  const {
    isLoading: tvLoading,
    data: tvData,
    refetch: searchTv,
    hasNextPage: tvHasNextPage,
    fetchNextPage: tvFetchNextPage,
  } = useInfiniteQuery(["searchTv", query], tvApi.search, {
    enabled: false,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });
  const onChangeText = (text: string) => setQuery(text);
  const onSubmit = () => {
    if (query === "") {
      return;
    }
    searchMovies();
    searchTv();
  };

  return (
    <Container>
      <SearchBar
        placeholder="Search for Movie or TV Show"
        placeholderTextColor="grey"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
      {moviesLoading || tvLoading ? <Loader /> : null}
      {moviesData ? (
        <HList
          title="Movie Results"
          data={moviesData.pages.map((page) => page.results).flat()}
          onEndReached={movieHasNextPage ? movieFetchNextPage : null}
        />
      ) : null}
      {tvData ? (
        <HList
          title="Tv Results"
          data={tvData.pages.map((page) => page.results).flat()}
          onEndReached={tvHasNextPage ? tvFetchNextPage : null}
        />
      ) : null}
    </Container>
  );
};

export default Search;
