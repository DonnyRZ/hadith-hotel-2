"use client";

import { useEffect, useRef, useState } from "react";

export type CustomSelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder: string;
  invalid?: boolean;
};

export function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function openDropdown() {
    const activeIndex = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    setHighlightedIndex(activeIndex);
    setOpen(true);
  }

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const node = listRef.current?.children[highlightedIndex] as
      | HTMLElement
      | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, highlightedIndex]);

  function commitSelection(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openDropdown();
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commitSelection(highlightedIndex);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div className="custom-select" ref={rootRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={
          invalid
            ? "custom-select__trigger custom-select__trigger--invalid"
            : "custom-select__trigger"
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className={
            selected
              ? "custom-select__value"
              : "custom-select__value custom-select__value--placeholder"
          }
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={
            open
              ? "custom-select__chevron custom-select__chevron--open"
              : "custom-select__chevron"
          }
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={
          open
            ? "custom-select__panel custom-select__panel--open"
            : "custom-select__panel"
        }
      >
        <ul
          ref={listRef}
          className="custom-select__list"
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            open && highlightedIndex >= 0
              ? `${id}-option-${highlightedIndex}`
              : undefined
          }
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={
                  "custom-select__option" +
                  (isSelected ? " custom-select__option--selected" : "") +
                  (isHighlighted ? " custom-select__option--highlighted" : "")
                }
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => commitSelection(index)}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
