import { Container } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "../../contexts/GlobalContext";
import { getTracks } from "../../utils/api";
import CustomTable from "./CustomTable";
const CleanSongTable = ({ title }) => {
  const { cleanedPlaylistID } = useGlobalState();
  const [cleanedTracks, setCleanedTracks] = useState();
  useEffect(() => {
    const getCleanedTracks = async () => {
      setCleanedTracks(await getTracks(cleanedPlaylistID));
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
  return (
    <Container p={3} boxShadow="lg" borderRadius={5}>
      <CustomTable hasRadio={false} columns={columns} data={data} />
    </Container>
  );
};

export default CleanSongTable;
