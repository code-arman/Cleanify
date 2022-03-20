import { Center, Container, Radio, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useGlobalState } from "../../contexts/GlobalContext";
import { getPlaylists } from "../../utils/api";
import CustomTable from "./CustomTable";

const PlaylistTable = () => {
  const { playlists, setPlaylists } = useGlobalState();

  useEffect(() => {
    const loadPlaylists = async () => {
      const p = await getPlaylists();
      setPlaylists(p);
    };
    loadPlaylists();
  }, [setPlaylists]);

  const data = [];
  playlists &&
    playlists.items.map((playlist, index) =>
      data.push({
        entry: { name: playlist.name, idx: String(index) },
      })
    );

  const columns = useMemo(
    () => [
      {
        Header: `Playlists`,
        accessor: "entry",
        Cell: ({ value: { name, idx } }) => (
          <Radio value={String(idx)}>{name}</Radio>
        ),
      },
    ],
    []
  );

  return data.length === 0 ? (
    <Center p={3} boxShadow="lg" borderRadius={5} h="700px" flexDir="column">
      <Text mb={3}>Fetching playlists</Text>
      <Spinner />
    </Center>
  ) : (
    <Container p={3} boxShadow="lg" borderRadius={5}>
      <CustomTable columns={columns} data={data} hasRadio={true} />
    </Container>
  );
};
export default PlaylistTable;
