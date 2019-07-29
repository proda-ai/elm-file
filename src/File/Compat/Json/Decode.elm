module File.Compat.Json.Decode exposing (oneOrMore)

{-|


# Compat.Json.Decode to support FileList decoding

@docs oneOrMore

-}

import Json.Decode as Json exposing (..)


{-| Apply a decoder to each file in the FileList, in order.
from : <https://github.com/simonh1000/file-reader/blob/master/src/FileReader.elm>

In elm18. using the File.decoder will return a Value of:
{ 0: file1, 1: file2 } etc...

-}
fileListDecoder : Decoder a -> Decoder (List a)
fileListDecoder decoder =
    let
        decodeFileValues indexes =
            indexes
                |> List.map (\index -> Json.field (toString index) decoder)
                |> List.foldr (Json.map2 (::)) (Json.succeed [])
    in
    Json.field "length" Json.int
        |> Json.map (\i -> List.range 0 (i - 1))
        |> Json.andThen decodeFileValues


{-| Decode a JSON array that has one or more elements. This comes up if you
want to enable drag-and-drop of files into your application. You would pair
this function with [`elm/file`]() to write a `dropDecoder` like this:
import File exposing (File)
import Json.Decoder as D
type Msg
= GotFiles File (List Files)
inputDecoder : D.Decoder Msg
inputDecoder =
D.at ["dataTransfer","files"] (D.oneOrMore GotFiles File.decoder)
This captures the fact that you can never drag-and-drop zero files.
-}
oneOrMore : (a -> List a -> value) -> Decoder a -> Decoder value
oneOrMore toValue decoder =
    fileListDecoder decoder
        |> andThen (oneOrMoreHelp toValue)


oneOrMoreHelp : (a -> List a -> value) -> List a -> Decoder value
oneOrMoreHelp toValue xs =
    case xs of
        [] ->
            fail "a ARRAY with at least ONE element"

        y :: ys ->
            succeed (toValue y ys)
