import styled from './header.module.scss';
/**
 * @export
 * @component
 * Responsável por renderizar o component Header
 */
export const Header = (): JSX.Element => {
  return (
    <header className={styled.headerStyled}>
      <div className={styled.contentStyled}>
        <img src="/assets/logo.png" alt="Logo" />
      </div>
    </header>
  );
};
