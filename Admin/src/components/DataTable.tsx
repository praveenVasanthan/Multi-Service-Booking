import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled, tableCellClasses } from "@mui/material";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default_image.jpg";

type DataTableProps = {
  columns: Record<string, string>;
  rows: Record<string, unknown>[];
  redirectPath?: string;
};

export default function DataTable({
  columns,
  rows,
  redirectPath,
}: DataTableProps) {
  const columnKeys = Object.keys(columns);
  const navigate = useNavigate();

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              {columnKeys.map((key) => (
                <StyledTableCell key={key}>{columns[key]}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnKeys.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow
                  key={i}
                  onClick={() =>
                    redirectPath && navigate(`/${redirectPath}/${row._id}`)
                  }
                  sx={{ cursor: redirectPath ? "pointer" : "default" }}
                >
                  {columnKeys.map((key) => (
                    <TableCell key={key}>
                      {key.toLowerCase().includes("image") &&
                      typeof row[key] === "string" ? (
                        <img
                          src={String(row[key]) || defaultImage}
                          alt="service"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : row[key] !== undefined ? (
                        String(row[key])
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1E293B",
    color: "#fff",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
