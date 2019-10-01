<?php

namespace RootNamespace\Generated\Auth;

interface RawTokenGetter
{
    public function getRawToken(string $refreshTokenValue): ?RawToken;
}