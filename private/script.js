function getText() {




    const data = {
        text: document.getElementById('exampleFormControlTextarea1').value
      };
      const jsonData = JSON.stringify(data, null, 2);
      
      fetch('/download1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error saving file');
        }
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'file.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        console.error('Error:', error);
      });
}