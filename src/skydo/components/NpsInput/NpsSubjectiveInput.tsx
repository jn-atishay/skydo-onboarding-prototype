import useNpsStore from "../../store/useNpsStore";
import TextInput from "../AtomicComponents/TextInput";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { NpsInputSource } from "../../constants/npsInputConstants";

interface Props {
  source: NpsInputSource;
}

const NpsSubjectiveInput = (props: Props) => {
  const { source } = props;
  const { subjectiveQuestion, subjectiveResponse, setSubjectiveResponse } = useNpsStore();

  if (subjectiveQuestion.length == 0) return null;

  const numRowsText = source == NpsInputSource.POP_UP ? 1 : 4;
  return (
    <div className={"flex flex-col space-y-2"}>
      <Typography
        text={subjectiveQuestion}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        fontWeight={"600"}
      />
      <TextInput
        placeholder={"Type here..."}
        value={subjectiveResponse}
        onChange={setSubjectiveResponse}
        inputProps={{ rows: numRowsText }}
        type={"textarea"}
      />
    </div>
  );
};

export default NpsSubjectiveInput;
