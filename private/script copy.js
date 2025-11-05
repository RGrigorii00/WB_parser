function getText() {
    const textarea = document.getElementById('exampleFormControlTextarea1');
    const text = textarea.value;
    console.log(text);

    // const select = document.getElementById('brand');
    // const select_option = select.options[select.selectedIndex];
    // const text_select = select_option.value;

    // const select_page = document.getElementById('page');
    // const select_page_option = select_page.options[select_page.selectedIndex];
    // const text_select_page = select_page_option.value;

    // const select_value_radio_1 = document.querySelector('input[name="flexRadioDefault"]:checked');
    // const select_value_radio_2 = document.querySelector('input[name="flexRadioDefaultt"]:checked');

    // if (select_value_radio_1) {
    //     svr1 = select_value_radio_1.value;
    // } else {
    //     svr1="";
    // }

    // if (select_value_radio_2) {
    //     svr2 = select_value_radio_2.value;
    // } else {
    //     svr2="";
    // }

    $.ajax({
        url: '/download1', // URL для отправки данных на сервер
        method: 'GET',
        contentType: 'application/json', // Тип контента, который отправляем (JSON)
        data: {
            data : JSON.stringify(text, null, 2),
        },
        success: function(response) {
            console.log('Данные успешно отправлены на сервер');
        },
        error: function(xhr, status, error) {
            console.error('Произошла ошибка при отправке данных:', error);
        }
    });

    const data = {
        text: document.getElementById('textarea').value
      };
      const jsonData = JSON.stringify(data);
      
      fetch('/save_file', {
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
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        console.error('Error:', error);
      });
}