import { useContext, useMemo } from "react";
import AuthContext from "../contexts/SpotifyAuthContext";
import CustomTable from "./CustomTable";
const SongTable = ({ title }) => {
  const { tracks } = useContext(AuthContext);

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

  tracks && tracks.items.map((t, index) => data.push({ name: t.track.name }));
  return <CustomTable hasRadio={false} columns={columns} data={data} />;
};

export default SongTable;
