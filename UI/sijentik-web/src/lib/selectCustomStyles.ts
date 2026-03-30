export const selectCustomStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'var(--color-surface, #ffffff)',
    borderColor: state.isFocused ? 'var(--color-primary, #0ea5e9)' : 'var(--color-border-subtle, #e2e8f0)',
    boxShadow: state.isFocused ? '0 0 0 1px var(--color-primary, #0ea5e9)' : 'none',
    minHeight: '38px',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--color-primary, #0ea5e9)' : '#cbd5e1'
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: 'var(--color-surface, #ffffff)',
    border: '1px solid var(--color-border-subtle, #e2e8f0)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 50,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? 'var(--color-primary, #0ea5e9)' : state.isFocused ? '#f8fafc' : 'transparent',
    color: state.isSelected ? 'white' : 'var(--color-text-main, #334155)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'var(--color-primary, #0ea5e9)',
      color: 'white'
    }
  }),
  singleValue: (base: any) => ({ ...base, color: 'var(--color-text-main, #334155)' }),
  placeholder: (base: any) => ({ ...base, color: '#94a3b8', fontSize: '0.875rem' }),
  input: (base: any) => ({ ...base, color: 'var(--color-text-main, #334155)' }),
  indicatorSeparator: () => ({ display: 'none' })
};
