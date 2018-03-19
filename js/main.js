$(document).ready(() => {
    $('.delete-article').on('click', (e) => {
        //get the data-id from the delete btn
        $target = $(e.target);
        const id = $target.attr('data-id');
        //Ajax needed to make delete request
        $.ajax({
            type:'DELETE',
            url: '/article/'+id,
            success: (response) => {
                alert('Deleting Article');
                window.location.href='/'
            },
            erroe: (err) => {
                console.log(err);
            }
        });
    })
});