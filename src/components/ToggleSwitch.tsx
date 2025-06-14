// src/components/ToggleSwitch.tsx
import styled from "styled-components";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  children?: React.ReactNode; // pour passer le label en tant qu’enfant
}

// Checkbox masquée pour accessibilité
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

// Le “track” du switch
const StyledSwitch = styled.span<{ checked: boolean; disabled?: boolean }>`
  display: inline-block;
  width: 40px;
  height: 20px;
  background: ${({ checked }) => (checked ? "#4caf50" : "#ccc")};
  border-radius: 20px;
  position: relative;
  transition: background 0.3s;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  flex-shrink: 0;
`;

// Le “thumb” qui se déplace
const StyledThumb = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ checked }) => (checked ? "20px" : "2px")};
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: left 0.3s;
`;

// Conteneur qui gère le clic et englobe le switch + texte
const ToggleContainer = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  user-select: none;
`;

// L’élément pour le texte du label
const LabelText = styled.span<{ disabled?: boolean }>`
  margin-left: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ToggleSwitch: React.FC<ToggleProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  checked,
  onChange,
  disabled,
  id,
  children,
  ...rest
}) => {
  // Lorsqu’on clique sur le Switch (StyledSwitch), on appelle onChange(!checked).
  // Le HiddenCheckbox permet l’accessibilité, mais on oriente le clic vers le label complet.
  return (
    <ToggleContainer disabled={disabled} htmlFor={id}>
      <HiddenCheckbox
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
        {...rest}
      />
      <StyledSwitch
        checked={checked}
        disabled={disabled}
        // onClick sur le switch visuel
        onClick={e => {
          e.preventDefault(); // éviter double toggle
          if (!disabled) {
            onChange(!checked);
          }
        }}
      >
        <StyledThumb checked={checked} />
      </StyledSwitch>
      {children && (
        <LabelText disabled={disabled} onClick={e => {
          // Cliquer sur le texte doit aussi toggler
          e.preventDefault();
          if (!disabled) {
            onChange(!checked);
          }
        }}>
          {children}
        </LabelText>
      )}
    </ToggleContainer>
  );
};

export default ToggleSwitch;
