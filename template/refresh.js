const refresh = `const updateBrowser = () => {
    window.location.reload();
  };
  const refresh = () => {
    const evtSource = new EventSource("<url>/subscribe");
    evtSource.onmessage = () => {
      updateBrowser();
    };
  };
  refresh();
  `;
export default refresh;
