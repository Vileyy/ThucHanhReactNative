const TIMEOUT_DURATION = 300000;

const fetchWithTimeout = async (url, timeout = TIMEOUT_DURATION) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timeout - Vui lòng kiểm tra kết nối mạng và thử lại"
      );
    }
    throw error;
  }
};

export const fetchContacts = async () => {
  try {
    const response = await fetchWithTimeout(
      "https://randomuser.me/api/?results=100&seed=fullstackio"
    );
    const { results } = await response.json();

    return results.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      phone: user.phone,
      cell: user.cell,
      email: user.email,
      avatar: user.picture.large,
      favorite: Math.random() < 0.3,
    }));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const fetchUserContact = async () => {
  try {
    const response = await fetchWithTimeout(
      "https://randomuser.me/api/?seed=fullstackio"
    );
    const { results } = await response.json();
    const user = results[0];

    return {
      name: `${user.name.first} ${user.name.last}`,
      phone: user.phone,
      cell: user.cell,
      email: user.email,
      avatar: user.picture.large,
    };
  } catch (error) {
    console.error("Error fetching user contact:", error);
    throw error;
  }
};

export const fetchRandomContact = async () => {
  try {
    const response = await fetchWithTimeout("https://randomuser.me/api/");
    const { results } = await response.json();
    const user = results[0];

    return {
      name: `${user.name.first} ${user.name.last}`,
      phone: user.phone,
      cell: user.cell,
      email: user.email,
      avatar: user.picture.large,
    };
  } catch (error) {
    console.error("Error fetching random contact:", error);
    throw error;
  }
};
