import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../contexts/SpotifyAuthContext";
import { getTracks } from "../utils/api";
// import { getTracks } from "../utils/api";
import CustomTable from "./CustomTable";
const CleanSongTable = ({ title }) => {
  const { cleanedPlaylistID } = useContext(AuthContext);
  const [cleanedTracks, setCleanedTracks] = useState();
  useEffect(() => {
    const getCleanedTracks = async () => {
      const p = await getTracks(cleanedPlaylistID);
      setCleanedTracks(p);
    };
    getCleanedTracks();
  }, [cleanedPlaylistID]);
  const columns = useMemo(
    () => [
      {
        Header: title,
        accessor: "name",
      },
    ],
    [title]
  );
  const data = [];

  cleanedTracks &&
    cleanedTracks.items.map((t) => data.push({ name: t.track.name }));
  return <CustomTable hasRadio={false} columns={columns} data={data} />;
};

export default CleanSongTable;
