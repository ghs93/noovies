import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { Movie, TV } from "../api";
import VMedia from "./VMedia";

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
  margin-bottom: 20px;
`;

export const HListSeparator = styled.View`
  width: 20px;
`;

interface HListProps {
  title: string;
  data: any[];
  onEndReached: any;
}

const HList: React.FC<HListProps> = ({ title, data, onEndReached }) => (
  <ListContainer>
    <ListTitle>{title}</ListTitle>
    <FlatList
      onEndReached={onEndReached}
      data={data}
      keyExtractor={(item) => item.id + ""}
      horizontal
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={HListSeparator}
      contentContainerStyle={{ paddingHorizontal: 30 }}
      renderItem={({ item }) => (
        <VMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.original_name ?? item.original_title}
          voteAverage={item.vote_average}
          fullData={item}
        />
      )}
    />
  </ListContainer>
);

export default HList;
