import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
} from "material-react-table";
import { toast } from "react-toastify";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  createTheme,
  Button,
  DialogContentText,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  DELETE_API_JWT,
  GET_API_JWT,
  POST_API_JWT,
} from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";

export type Person = {
  Student_Id: number;
  First_Name: string;
  Last_Name: string;
  Email: string;
  Academics: string;
  photo: any;
};

const Students = () => {
  const jwt = GET_JWT_TOKEN();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isLoading, setisLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<Person[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
  let data: any;
  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await GET_API_JWT("students/", jwt);
      data = response.data;
      if (!response.status) {
        toast.error(response.message);
      }
      setTableData(data);
      setisLoading(false);
    } catch (error: any) {
      console.log("Error fetching data" + error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleCreateNewRow = async (values: Person) => {
    const response = await POST_API_JWT("students/register", values, jwt);
    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    await fetchData();
  };

  const handleSaveRowEdits: MaterialReactTableProps<Person>["onEditingRowSave"] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        let { Student_Id } = values;
        const response = await POST_API_JWT(
          `students/edit/${Student_Id}`,
          values,
          jwt
        );
        if (response.status) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        await fetchData();
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };
  const handleDeleteRow = async (row: any) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleConfirmDelete = async () => {
    setOpen(false);
    if (!selectedRow) return;

    const Student_Id = selectedRow.getValue("Student_Id");

    const response = await DELETE_API_JWT(`students/delete/${Student_Id}`, jwt);

    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    fetchData();
  };

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Person>
    ): MRT_ColumnDef<Person>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "Email"
              ? validateEmail(event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `Valid ${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "Student_Id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorFn: (row: any) => {
          return (
            <img
              style={{ width: "60px", height: "auto" }}
              alt={`${row.First_Name} Profile Pic`}
              src={
                row.photo
                  ? row.photo
                  : "https://meet-plus.com/img/icons/avatar.svg"
              }
            />
          );
        },
        // enableEditing: false, //disable editing on this column
        accessorKey: "photo",
        header: "Profile",
        size: 80,
      },
      {
        accessorKey: "First_Name",
        header: "First Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "Last_Name",
        header: "Last Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "Email",
        header: "Email",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "email",
        }),
      },
      {
        accessorKey: "Academics",
        header: "Academics",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <ThemeProvider theme={createTheme()}>
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              size: 120,
            },
          }}
          columns={columns}
          state={{ isLoading }}
          data={tableData ?? []}
          editingMode="modal"
          enableColumnOrdering
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Button
              color="primary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Add Student
            </Button>
          )}
        />
        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {"Are you sure you want to delete the details of " +
                selectedRow?.getValue("First_Name") +
                " and its transactions."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<Person>[];
  onClose: () => void;
  onSubmit: (values: Person) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {} as any)
  );
  const [err, setErr]: any = useState(null);
  const handleSubmit = async () => {
    //put your validation logic here
    if (
      values.First_Name !== "" &&
      values.Last_Name !== "" &&
      values.Email !== "" &&
      values.Academics !== ""
    ) {
      onSubmit(values);
      onClose();
    } else {
      setErr("All field are mandatory to heads up.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Add Student</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              console.log(column.accessorKey);
              if (column.accessorKey === "Student_Id") {
                return null;
              } else if (column.accessorKey === "photo") {
                return null;
              }
              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              );
            })}
          </Stack>
        </form>
        <p style={{ color: "red" }}>{err ? err : null}</p>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Add Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

export default Students;
