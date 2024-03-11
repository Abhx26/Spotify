import React from 'react'
import SingleSongCard from "../components/shared/SingleSongCard"
import {makeUnAuthenticatedGETRequest} from "../utils/serverHelpers";
import { useState,useEffect } from 'react';
import LoggedInContainer from '../containers/LoggedInContainer';

const LikedSongs = () => {
    const [songData, setSongData] = useState([]);
    useEffect(() => {
        const getData = async () => {
            const response = await makeUnAuthenticatedGETRequest(
                "/likeSongs/getallLikedSongs"
            );
            setSongData(response.allSongs);
            
        };
        getData();
    }, []);
  return (
    <LoggedInContainer curActiveScreen="myMusic">
            <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
                My Songs
            </div>
            <div className="space-y-3 overflow-auto">
                {songData.map((item) => {
                    return <SingleSongCard info={item.songt} playSound={() => {}} />;
                })}
            </div>
        </LoggedInContainer>
  )
}

export default LikedSongs