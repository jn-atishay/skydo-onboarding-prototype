import React, { FormEvent, useEffect, useRef } from "react";

interface Props {
  onSubmit: (event?: KeyboardEvent) => void;
  children: React.ReactNode | React.ReactElement | React.ReactElement[];
  className?: string;
}

const CustomisedNavigationForm = (props: Props) => {
  const formRef = useRef<null | HTMLFormElement>(null);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      const elements = formRef?.current?.elements || [];
      const totalElements = elements?.length;
      const secondLastElement = elements[totalElements - 2];
      const lastElement = elements[totalElements - 1];
      if (e.target === secondLastElement || e.target === lastElement) {
        props.onSubmit(e);
      }
      return;
    }
  };

  useEffect(() => {
    const form = formRef?.current as HTMLFormElement;
    form?.addEventListener("keydown", onKeydown);
    return () => {
      formRef?.current?.removeEventListener("keydown", onKeydown);
    };
  }, [Object.values(props)]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className={props.className || ""}>
      {props.children}
    </form>
  );
};

export default CustomisedNavigationForm;
