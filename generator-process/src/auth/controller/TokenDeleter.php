<?php

namespace RootNamespace\Generated\Auth;

interface TokenDeleter
{
    public function delete(RefreshToken $token): ?RawToken;
}