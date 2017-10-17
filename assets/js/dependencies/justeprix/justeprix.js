$(document).ready(function() {

  /*
  * Déclaration des variables
  */
  var isStarted;
  var inter;
  var beep;
  var beepLoop;
  var priceId;
  var baseURL;

  // On initialise les variables
  init()

  /*
  * Initialisation des variables et du formulaire
  */
  function init() {
    // Remplissage de la barre de progression
    baseURL = 'http://localhost:1337/'
    $('#restart').hide()
    $('#send').show()
    $('#result').hide()
    $('#progress').progress(
      {
        value: 300,
        text: {
          active  : false,
          error   : false,
          success : false,
          warning : false,
          percent : false,
          ratio   : false
        }
      }
    )
    isStarted = false
    $.ajax({
        url: baseURL + 'price',
        beforeSend: function () {
          $('#loader').show()
        }
      }).done(function (data) {
        priceId = data.id;
        $('#loader').hide()
        $('#image').attr('src', 'images/readytostarticon.png').show()
        $('#prix').removeAttr('disabled').val('')
      })
    beep = new Audio('sons/beep.wav')
  }

  /*
  * Vérification de la saisie d'un prix
  * Lancement du compte à rebours si nécessaire
  */
  function checkSaisie() {
    var saisie = $('#prix').val()
    var url = baseURL + 'price/' + priceId + '/' + saisie
    if (saisie) {
      $.ajax({
        url: url,
	beforeSend: function () {
	  $('#image').hide()
          $('#loader').show()
	}
      }).done(function (data) {
        $('#loader').hide()
        if (data.error) {
          printError(data.error)
        } else {
          checkPrix(data.response)
        }
      })
      if (!isStarted) {
        isStarted = true
        inter = setInterval(refreshTimer, 100)
        beepLoop = setInterval(playLoop, 1000)
      }
      checkPrix(saisie)
    }
  }

  /*
  * Compte à rebours
  */
  function refreshTimer() {
    $('#progress').progress('decrement')
    var time = $('#progress').progress('get value')
    if (time === 100) {
      $('#progress').removeClass('green').addClass('orange')
    	clearInterval(beepLoop)
     	beepLoop = setInterval(playLoop, 750)
    }
    if (time === 50) {
      $('#progress').removeClass('orange').addClass('red')
    	clearInterval(beepLoop)
     	beepLoop = setInterval(playLoop, 500)
    }
    if (time === 0) {
      var aDeviner
      $.get({
        url: baseURL + 'result/' + priceId,
	beforeSend: function () {
	  $('#image').hide()
          $('#loader').show()
        }

      }).done(function (data) {
          $('#loader').hide()
          if (data.err) {
            printError(data.err)
            return
          } else {
            aDeviner = data.price
            $('#showPrice').text(aDeviner)
            $('#image').slideUp('slow', function () {
              $('#result').slideDown('slow')
            })
          }
        })
      clearInterval(inter)
      clearInterval(beepLoop)
      $('#send').hide()
      $('#prix').attr('disabled', 'true')
      $("#restart").fadeToggle(100)
    }
  }

  /*
  * Vérification du prix
  */
  function checkPrix(response) {
    if (response == 'plus') {
      $('#image').attr('src', 'https://i.imgflip.com/1lktin.jpg').show()
      $('#prix').focus()
    } else if (response == 'moins') {
      $('#image').attr('src', 'https://i.imgflip.com/1lktkm.jpg').show()
      $('#prix').focus()
    } else if (response == 'gagne') {
      clearInterval(inter)
      clearInterval(beepLoop)
      $('#send').fadeToggle(100)
      $("#restart").fadeToggle(100)
      $('#prix').attr('disabled', 'true')
      $('#image').attr('src', 'https://i.imgflip.com/1lktnl.jpg').show()
    }
  }

  /*
  * Affiche un message d'erreur
  */
  function printError(error) {
    $('#message').text(error)
    $('#errorBox').show()
  }

  /*
  * Jouer le son
  */
  function playLoop() {
    beep.play()
    setTimeout(function () {
      beep.pause()
      beep.currentTime = 0
    }, 200)
  }

  /*
  * Evenement sur les boutons
  */
  $('.form').submit(function(event) {
    event.preventDefault()
    checkSaisie()
  })
  $('#restart').click(init)
  $('#closeBox').click(function () {
    $('#errorBox').hide()
  })
})
