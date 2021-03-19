<?php

/**
 *  Версия: 1
 *  Автор: Jakksonn
 *  Дата выхода: 15.11.2020
 *  Для использования API, заполните PROJECT_ID, TOKEN и RESPONSE_KEY,
 *  затем подключите класс к своему коду: require_once 'SpApi.php';
 *  и вызывайте методы класса, например: $result = SpApi::test();
 */

class SpApi {
    private const PROJECT_ID = '';       // Введите сюда id проекта (sp/spm/spk)
    private const TOKEN = '';            // Введите сюда токен своего приложения
    private const RESPONSE_KEY = '';     // Введите сюда ключ_серверного_ответа своего приложения

    /** Service methods: */

    private static function prepareActionUrl(){
        SpApi::checkConstants();
        return "https://" . SpApi::PROJECT_ID . ".jakksoft.com/api/request";
    }

    private static function checkConstants(){
        if(empty(SpApi::PROJECT_ID)){ die('Введите id проекта в файл SpApi.php'); }
        if(empty(SpApi::TOKEN)){ die('Введите токен своего SP приложения в файл SpApi.php'); }
        if(empty(SpApi::RESPONSE_KEY)){ die('Введите ключ_серверного_ответа своего SP приложения в файл SpApi.php'); }
    }

    private static function getBadResponseTemplate($error){
        return array (
            'success' => false,
            'data' => [],
            'errors' => [$error]
        );
    }

    private static function prepareResponse($action, $data = []){
        $url = SpApi::prepareActionUrl();

        $secureData = array (
            'action' => $action,
            'token' => SpApi::TOKEN,
        );

        $data = array_merge($secureData, $data);

        try {
            $options = array(
                'http' => array(
                    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method'  => 'POST',
                    'content' => http_build_query($data)
                )
            );
            $context  = stream_context_create($options);
            $jsonResponse = file_get_contents($url, false, $context);
            if ($jsonResponse === FALSE) {
                return SpApi::getBadResponseTemplate("Ответ от API не получен.");
            }

            $parsedResponse = json_decode($jsonResponse);

            if(empty($parsedResponse->response_key) || $parsedResponse->response_key != SpApi::RESPONSE_KEY){
                $error = "Ответ от сервера не прошёл валидацию. ";

                if(isset($parsedResponse->errors) && count($parsedResponse->errors) > 0){
                    $error .= implode('; ', $parsedResponse->errors);
                }

                return SpApi::getBadResponseTemplate($error);
            }

            if(empty($parsedResponse) || !isset($parsedResponse->success)){
                return SpApi::getBadResponseTemplate("Ошибка парсинга ответа с сервера SP");
            }

            unset($parsedResponse->response_key);
            return $parsedResponse;
        }catch (Exception $e){
            return SpApi::getBadResponseTemplate($e->getMessage());
        }
    }


    /** API methods: */

    public static function test(){
        return SpApi::prepareResponse('test');
    }

    public static function permissionTest($licenseKey){
        if(empty($licenseKey)){
            die("Не указан ключ лицензии пользователя.");
        }

        $parameters = array (
            'license_key' => $licenseKey
        );

        return SpApi::prepareResponse('permission_test', $parameters);
    }

    public static function pay($spPayCode, $sum, $transactionMessage){
        if(empty($spPayCode)){
            die("SP-Pay код не указан.");
        }
        if(empty($sum)){
            die("Не указана сумма к оплате.");
        }
        if(empty($transactionMessage)){
            die("Не указано описание транзакции.");
        }

        $parameters = array (
            'spPayCode' => $spPayCode,
            'sum' => $sum,
            'transactionMessage' => $transactionMessage
        );

        return SpApi::prepareResponse('pay', $parameters);
    }

    public static function getPermission($licenseKey, $permissionId){
        if(empty($licenseKey)){
            die("Не указан ключ лицензии пользователя.");
        }
        if(empty($permissionId)){
            die("Не указан ID разрешения.");
        }

        $parameters = array (
            'license_key' => $licenseKey,
            'permission_id' => $permissionId,
        );

        return SpApi::prepareResponse('get_permission', $parameters);
    }

    public static function getCardsInfo($licenseKey){
        if(empty($licenseKey)){
            die("Не указан ключ лицензии пользователя.");
        }

        $parameters = array (
            'license_key' => $licenseKey
        );

        return SpApi::prepareResponse('get_cards_info', $parameters);
    }

    public static function getUnreadNotifications($licenseKey){
        if(empty($licenseKey)){
            die("Не указан ключ лицензии пользователя.");
        }

        $parameters = array (
            'license_key' => $licenseKey
        );

        return SpApi::prepareResponse('get_unread_notifications', $parameters);
    }

    public static function markNotificationsAsRead($licenseKey){
        if(empty($licenseKey)){
            die("Не указан ключ лицензии пользователя.");
        }

        $parameters = array (
            'license_key' => $licenseKey
        );

        return SpApi::prepareResponse('mark_notifications_as_read', $parameters);
    }


}