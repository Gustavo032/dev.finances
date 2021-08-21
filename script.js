const modalElement = document.querySelector('.modal-overlay')

const modal = {
    open(){
        modalElement.classList.add('active')
    },

    close(){
        modalElement.classList.remove('active')
    }
}