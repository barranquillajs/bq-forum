import { initializeAuth, initializeRandom } from "@lib/auth";

export const AuthButton = () => {
  const handleClick = () => {
    const { state, codeVerifier } = initializeRandom();
    initializeAuth(codeVerifier, state);
  };

  return (
    <button className="btn btn-info" onClick={handleClick}>
      Iniciar sesión
    </button>
  );
};
