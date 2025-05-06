import { toast } from 'react-toastify';

/**
 * Checks if user is authenticated and redirects to login if not
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @param {function} navigate - React Router's navigate function
 * @param {string} action - The action being attempted (e.g., "add to cart")
 * @param {string} returnUrl - URL to return to after login (optional)
 * @returns {boolean} - Whether the user is authenticated
 */
export const requireAuth = (isAuthenticated, navigate, action = "continue", returnUrl = "") => {
  if (!isAuthenticated) {
    // Store the return URL in session storage if provided
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
    
    // Show toast notification
    toast.info(`Please log in to ${action}`, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Redirect to login page
    navigate('/login');
    return false;
  }
  
  return true;
};

/**
 * Gets the stored return URL and clears it from storage
 * @returns {string|null} - The return URL or null if not found
 */
export const getReturnUrl = () => {
  const returnUrl = sessionStorage.getItem('returnUrl');
  if (returnUrl) {
    sessionStorage.removeItem('returnUrl');
    return returnUrl;
  }
  return null;
};
