import { Autocomplete, Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import nepaliDateConverter from "nepali-date-converter";

interface CreateModalProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  Students: any;
  Books: any;
}
const AddModal = ({
  open,
  onClose,
  onSubmit,
  Students,
  Books,
}: CreateModalProps) => {
  const dateNp = new nepaliDateConverter(new Date()).getDateObject().BS;
  const nepaliDateNow =
    dateNp.year + "-" + (dateNp.month + 1) + "-" + dateNp.date;
  const status = "Issued";
  const [date, setDate] = useState<any>(nepaliDateNow);
  const [err, setErr] = useState("");
  const [Book, setBook] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [newInputValue, setNewInputValue] = useState<any>("");
  const [student, setStudent] = useState<any>(null);
  const handleDate = (date: any) => {
    setDate(date);
  };

  const handleSubmit = () => {
    const values: any = {
      Due_Date: date,
      Book_Id: Book?.id,
      Status: status,
      Student_Id: student?.id,
      NepaliDate: nepaliDateNow,
    };

    if (
      values.Book_Id &&
      values.Due_Date != "" &&
      values.Student_Id &&
      values.Due_Date !== null &&
      values.NepaliDate
    ) {
      onSubmit(values);
      setInputValue("");
      setNewInputValue("");
      setBook(null);
      setStudent(null);
      onClose();
    } else {
      setErr("All field are mandatory to heads up.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 className=" text-2xl font-extrabold leading-none tracking-tight text-gray-900 my-4">
          Issue Book
        </h2>
        {Books ? (
          <Autocomplete
            className="w-full mt-3 py-3"
            value={Book}
            onChange={(event, newValue) => {
              event;
              setBook(newValue);
            }}
            inputValue={newInputValue}
            onInputChange={(event, newInputValue) => {
              event;
              setNewInputValue(newInputValue);
            }}
            id="manageable-states-demo"
            options={Books}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Books" />}
          />
        ) : (
          <>
            <TextField
              value={"No Books Found"}
              disabled
              type="text"
              id="outlined-basic"
              label="Books"
              variant="standard"
            />
            <br />
          </>
        )}
        {Students ? (
          <Autocomplete
            className="w-full py-3"
            value={student}
            onChange={(event, newValue: any) => {
              event;
              setStudent(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue: any) => {
              event;
              setInputValue(newInputValue);
            }}
            id="manageable-states-demo"
            options={Students}
            getOptionLabel={(option) => option.label} // Use 'label' property to display the label
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Students" />}
          />
        ) : (
          <>
            <br />
            <TextField
              value={"No Students Found"}
              disabled
              type="text"
              id="outlined-basic"
              label="Students"
              variant="standard"
            />
            <br />
            <br />
          </>
        )}
        <label htmlFor="Date">Due Date :</label>
        <NepaliDatePicker
          value={date}
          options={{ calenderLocale: "ne", valueLocale: "en" }}
          inputClassName="w-full px-3 my-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          onChange={handleDate}
        />
        <p className="text-sm text-red-700">{err ? err : null}</p>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button color="primary" sx={{ mr: 2 }} onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddModal;
