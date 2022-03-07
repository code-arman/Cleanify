import { Radio } from "@chakra-ui/react";
import { useContext, useEffect, useMemo } from "react";
import AuthContext from "../contexts/SpotifyAuthContext";
import { getPlaylists } from "../utils/api";
import CustomTable from "./CustomTable";

const PlaylistTable = () => {
  const { playlists, setPlaylists } = useContext(AuthContext);

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

  return <CustomTable columns={columns} data={data} hasRadio={true} />;
};
export default PlaylistTable;
