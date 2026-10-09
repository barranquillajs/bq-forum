import { AUTH_BUTTON_ID, AUTH_BUTTON_ANCHOR } from '@constants/uiIds';
import { login, logout } from '@lib/auth';
import type { User } from '@lib/types';

export const AuthButton = ({ userData }: { userData: User | undefined }) => {
  if (!userData?.avatarUrl)
    return (
      <button className="btn btn-warning btn-sm" onClick={() => login()}>
        Iniciar sesión
      </button>
    );

  return (
    <>
      <button
        className="cursor-pointer"
        popoverTarget={AUTH_BUTTON_ID}
        style={{ anchorName: AUTH_BUTTON_ANCHOR }}
      >
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img alt={`Usuario: ${userData.name}`} src={userData.avatarUrl} />
          </div>
        </div>
      </button>
      <ul
        className="dropdown dropdown-end mt-2 menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id={AUTH_BUTTON_ID}
        style={{ positionAnchor: AUTH_BUTTON_ANCHOR }}
      >
        <li onClick={() => logout()}>
          <a>Cerrar sesión</a>
        </li>
      </ul>
    </>
  );
};
