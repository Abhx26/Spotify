import {useContext, useState, useLayoutEffect, useRef, useEffect} from "react";
import {Howl, Howler} from "howler";
import {Icon} from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import songContext from "../contexts/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import {makeAuthenticatedPOSTRequest, makeUnauthenticatedPOSTRequest,makeUnAuthenticatedGETRequest,makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import {useCookies} from "react-cookie";
import MusicPlayer from "../components/shared/MusicPlayer";
import MusicBarBottom from '../components/MusicBarBottom';
const LoggedInContainer = ({children, curActiveScreen}) => {
    const [cookies, setCookie] = useCookies(["token"]);
    const [createPlaylistModalOpen, setCreatePlaylistModalOpen] =
        useState(false);
    const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
    const [songData, setSongData] = useState([]);
    const [likesong,setlikesong]=useState(0);
    const [allSong,setallSong]= useState([]);
    const {
        currentSong,
        setCurrentSong,
        soundPlayed,
        setSoundPlayed,
        isPaused,
        setIsPaused,
    } = useContext(songContext);

    const firstUpdate = useRef(true);

    useLayoutEffect(() => {
        // the following if statement will prevent the useEffect from running on the first render.
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        if (!currentSong) {
            return;
        }
        changeSong(currentSong.track);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        
    }, [currentSong && currentSong.track]);
    const addlikedSongs=async()=>
    {

        const songt = currentSong._id;
        //console.log(songt);
        const payload = { songt};
        
        //console.log(payload);
        const response = await makeUnauthenticatedPOSTRequest(
            "/likeSongs/likedSongs",
            payload

        );
        //setSongData(response.data);
        //console.log(response);
        setlikesong(true);
        

    }


    const removeLikeSongs=async()=>
    {
        const songt = currentSong._id;
        //console.log(songt);
        const payload = {songt};
        //console.log(payload);
        const response = await makeUnauthenticatedPOSTRequest(
            "/likeSongs/removeLike",
            payload

        );
        //setSongData(response.data);
        //console.log(response);
        setlikesong(false);

    }

    const playNextSong = () => {
        console.log(allSong.data);
        console.log(currentSong._id);
        const currentPos = allSong.data.findIndex(song => song._id === currentSong._id);
        console.log(currentPos);
        console.log(allSong.data.length-1);
        if (currentPos === allSong.data.length -1) {
            setCurrentSong(allSong.data[0]);
            console.log("Play next");       
        } else {
            setCurrentSong(allSong.data[currentPos + 1]);
            console.log(allSong.data[currentPos+1]);
        }
        console.log(currentSong._id);    
    };


    const playPrevSong = () => {
        console.log(allSong.data);
        console.log(currentSong._id);
        const currentPos = allSong.data.findIndex(song => song._id === currentSong._id);
        console.log(currentPos);
        console.log(allSong.data.length-1);
        if (currentPos === 0) {
            setCurrentSong(allSong.data[allSong.data.length-1]);
            console.log("Pl");       
        } else {
            setCurrentSong(allSong.data[currentPos - 1]);
            console.log(allSong.data[currentPos+1]);
        }
        console.log(currentSong._id);    
    };

    useEffect(() => {
        const getData = async () => {
            const response = await makeUnAuthenticatedGETRequest(
                "/likeSongs/getallLikedSongs"
            );
            //console.log(response);
            const allSongs1 = await makeAuthenticatedGETRequest(
                "/song/get/mysongs"
            );
            setallSong(allSongs1);
            const songIds = response.allSongs.map(song =>song.songt._id);
            //console.log("Song ids are ", songIds);
            //console.log("Current song id is ", currentSong._id);
            const isLikedSong = songIds.includes(currentSong._id); 
            //console.log(isLikedSong);
            setlikesong(isLikedSong);
        };
        getData();
    }, [currentSong]);
   

    const addSongToPlaylist = async (playlistId) => {
        const songId = currentSong._id;

        const payload = {playlistId, songId};
        const response = await makeAuthenticatedPOSTRequest(
            "/playlist/add/song",
            payload
        );
        if(response._id){
            setAddToPlaylistModalOpen(false)
        }
    };
    

    const playSound = () => {
        if (!soundPlayed) {
            return;
        }
        soundPlayed.play();
    };

    const changeSong = (songSrc) => {
        if (soundPlayed) {
            soundPlayed.stop();
        }
        let sound = new Howl({
            src: [songSrc],
            html5: true,
        });
        setSoundPlayed(sound);
        sound.play();
        setIsPaused(false);
    };

    const pauseSound = () => {
        soundPlayed.pause();
    };

    const togglePlayPause = () => {
        if (isPaused) {
            playSound();
            setIsPaused(false);
        } else {
            pauseSound();
            setIsPaused(true);
        }
    };

    return (
        <div className="h-full w-full bg-app-black">
            {createPlaylistModalOpen && (
                <CreatePlaylistModal
                    closeModal={() => {
                        setCreatePlaylistModalOpen(false);
                    }}
                />
            )}
            {addToPlaylistModalOpen && (
                <AddToPlaylistModal
                    closeModal={() => {
                        setAddToPlaylistModalOpen(false);
                    }}
                    addSongToPlaylist={addSongToPlaylist}
                />
            )}
            <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
                {/* This first div will be the left panel */}
                <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
                    <div>
                        {/* This div is for logo */}
                        <div className="logoDiv p-6">
                            <img
                                src={spotify_logo}
                                alt="spotify logo"
                                width={125}
                            />
                        </div>
                        <div className="py-5">
                            <IconText
                                iconName={"material-symbols:home"}
                                displayText={"Home"}
                                targetLink={"/home"}
                                active={curActiveScreen === "home"}
                            />
                            <IconText
                                iconName={"material-symbols:search-rounded"}
                                displayText={"Search"}
                                active={curActiveScreen === "search"}
                                targetLink={"/search"}
                            />
                            <IconText
                                iconName={"icomoon-free:books"}
                                displayText={"Library"}
                                active={curActiveScreen === "library"}
                                targetLink={"/library"}
                            />
                            <IconText
                                iconName={
                                    "material-symbols:library-music-sharp"
                                }
                                displayText={"My Music"}
                                targetLink="/myMusic"
                                active={curActiveScreen === "myMusic"}
                            />
                        </div>
                        <div className="pt-5">
                            <IconText
                                iconName={"material-symbols:add-box"}
                                displayText={"Create Playlist"}
                                onClick={() => {
                                    setCreatePlaylistModalOpen(true);
                                }}
                            />
                            <IconText
                                iconName={"mdi:cards-heart"}
                                displayText={"Liked Songs"}
                                targetLink="/likesongs"
                                
                            />
                        </div>
                    </div>
                    <div className="px-5">
                        <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
                            <Icon icon="carbon:earth-europe-africa" />
                            <div className="ml-2 text-sm font-semibold">
                                English
                            </div>
                        </div>
                    </div>
                </div>
                {/* This second div will be the right part(main content) */}
                <div className="h-full w-4/5 bg-app-black overflow-auto">
                    <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
                        <div className="w-1/2 flex h-full">
                            <div className="w-2/3 flex justify-around items-center">
                                <TextWithHover displayText={"Premium"} />
                                <TextWithHover displayText={"Support"} />
                                <TextWithHover displayText={"Download"} />
                                <div className="h-1/2 border-r border-white"></div>
                            </div>
                            <div className="w-2/3 flex justify-around h-full items-center">
                            <IconText
                                
                                displayText={"Upload Song"}
                                targetLink="/uploadSong"
                                
                            />
                            <IconText
                                
                                displayText={"Log out"}
                                 
                                targetLink="/login"
                               
                                
                            />
                            
                                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer">
                                    AC
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content p-8 pt-0 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
            
            {/* This div is the current playing song */}
            {currentSong && (
                <div className="w-full h-1/10 bg-black bg-opacity-30 text-white flex items-center px-4">
                    <div className="w-1/4 flex items-center">
                        <img
                            src={currentSong.thumbnail}
                            alt="currentSongThumbail"
                            className="h-14 w-14 rounded"
                        />
                        <div className="pl-4">
                            <div className="text-sm hover:underline cursor-pointer">
                                {currentSong.name}
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-1/2 flex justify-center h-full flex-col items-center">
                        <div className="flex w-1/3 justify-between items-center">
                            
                            <Icon
                                icon="ph:shuffle-fill"
                                fontSize={30}
                                className="cursor-pointer text-gray-500 hover:text-white"
                            />
                            <Icon
                                icon="mdi:skip-previous-outline"
                                fontSize={30}
                                className="cursor-pointer text-gray-500 hover:text-white"
                                onClick={playPrevSong}
                            />
                            <Icon
                                icon={
                                    isPaused
                                        ? "ic:baseline-play-circle"
                                        : "ic:baseline-pause-circle"
                                }
                                fontSize={50}
                                className="cursor-pointer text-gray-500 hover:text-white"
                                onClick={togglePlayPause}
                            />
                            <Icon
                                icon="mdi:skip-next-outline"
                                fontSize={30}
                                className="cursor-pointer text-gray-500 hover:text-white"
                                onClick={playNextSong}
                            />
                            <Icon
                                icon="ic:twotone-repeat"
                                fontSize={30}
                                className="cursor-pointer text-gray-500 hover:text-white"
                                onClick={()=>{}}
                            />
                        </div>
                            {/* Progress Bar here */}
                        
                    </div>
                    <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
                        <Icon
                            icon="ic:round-playlist-add"
                            fontSize={30}
                            className="cursor-pointer text-gray-500 hover:text-white"
                            onClick={() => {
                                setAddToPlaylistModalOpen(true);
                            }}
                        />
                        {likesong?
                        <FcLike
                            fontSize={25}
                            className="cursor-pointer text-gray-500 hover:text-white"
                            onClick={removeLikeSongs}
                        />:
                        <Icon
                            icon="ph:heart-bold"
                            fontSize={25}
                            className="cursor-pointer text-gray-500 hover:text-white"
                            onClick={addlikedSongs}
                        />
                        
                        }
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoggedInContainer;
